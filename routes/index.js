var express = require('express');
var router = express.Router();
const upload = require('../utils/multer')

const userModel = require('../models/user');
const  postModel = require('../models/post');
const passport = require('passport');
const localStrategy = require('passport-local');
// passport.use(new localStrategy(userModel.authenticate()));

passport.use(userModel.createStrategy())


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/register', function(req, res, next){
  try {
    let userData = new userModel({
      firstname: req.body.username,
      lastname: req.body.username,
      email: req.body.email,
      gender: req.body.gender,
      birth: req.body.birth,
      secret: req.body.secret,
    });

    userModel.register(userData, req.body.password)
    .then(function(){
      passport.authenticate('local')(req, res, function(){
        res.redirect('/login')
      });
    });
  } catch (error) {
    res.send(error)
  };
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/feed',
  failureRedirect: '/login'
}) ,function(){});

router.get('/logout', function(req, res, next){
  req.logout(function(err){
    if(err){ return next(err) };

    res.redirect('/login');
  });
});

function isLoggetedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  };

  res.redirect('/');
};

router.get('/feed', isLoggetedIn, async function(req, res, next) {
  try {
    const posts = await postModel.find().populate('user')
    res.render('feed', {posts})
  } catch (error) {
    res.send(error)
  }
});

router.get('/addfriends', isLoggetedIn, function(req, res, next) {
  res.render('addfriends');
});

router.get('/notification', isLoggetedIn, function(req, res, next) {
  res.render('notification');
});

router.get('/addvideo', isLoggetedIn, function(req, res, next) {
  res.render('addvideo');
});

router.get('/profile', isLoggetedIn, async function(req, res, next) {
  try {
    const data = await userModel.findById(req.user._id).populate('posts')
    console.log(data);
    res.render('profile', {data});
  } catch (error) {
    
  }
});

router.get('/videos', isLoggetedIn, async function(req, res, next) {
  try {
    const posts = await postModel.find().populate('user')
    res.render('videos', {posts})
  } catch (error) {
    res.send(error)
  }
});

router.get('/addpost', isLoggetedIn, function(req, res, next) {
  res.render('addpost');
});

router.get('/search', isLoggetedIn, function(req, res, next) {
  res.render('search');
});

router.get('/story', isLoggetedIn, function(req, res, next) {
  res.render('story');
});

router.get('/messenger', isLoggetedIn, function(req, res, next) {
  res.render('messenger');
});

router.get('/editprofile/:id', isLoggetedIn, async function(req, res, next) {
 try {
  const data = await userModel.findById(req.params.id)

  res.render('editprofile' , {data});
 } catch (error) {
  
 }
});

router.post('/upload', isLoggetedIn, upload.single('profileImage'), async function (req, res, next) {
  try {
    const user = await userModel.findOne(req.user)
    user.profileImage = req.file.filename;
    await user.save()
    res.redirect('/profile')
  } catch (error) { 
    console.log(error)
    res.send(error)
  }
});

router.post('/uploadcover', isLoggetedIn, upload.single('coverImage'), async function (req, res, next) {
  try {
    const user = await userModel.findOne(req.user)
    user.coverImage = req.file.filename;
    await user.save()
    res.redirect('/profile')
  } catch (error) { 
    console.log(error)
    res.send(error)
  }
});

router.post('/update/:id', isLoggetedIn, async function(req, res, next){
  try {
    const user = await userModel.findByIdAndUpdate(req.params.id,req.body);

        await user.save();
        res.redirect('/profile')
    
  } catch (error) {
    res.send(error)
  }
});

router.post("/createpost", isLoggetedIn, upload.single('postImage'), async function(req, res, next){
  try {
    const user = await userModel.findOne(req.user);

    const media = new postModel({
      postImage: req.file.filename,
      caption: req.body.caption,
      user: user._id
    });

    user.posts.push(media._id)
    await media.save();
    await user.save();
    res.redirect('/feed');

  } catch (error) {
    res.send(error)
  }
})


router.post('/uploadstory', isLoggetedIn, upload.single('story'), async function (req, res, next) {
  try {
    const user = await userModel.findOne(req.user)
    user.story = req.file.filename;
    await user.save()
    res.redirect('/feed')
  } catch (error) { 
    console.log(error)
    res.send(error)
  }
});

router.post('/addvideo', isLoggetedIn, upload.single('video'), async function (req, res, next) {
  try {
    const user = await userModel.findOne(req.user)
    user.video = req.file.filename;
    await user.save()
    res.redirect('/videos')
  } catch (error) { 
    console.log(error)
    res.send(error)
  }
});


module.exports = router;
