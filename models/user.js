const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect('mongodb://0.0.0.0/fb').then(()=> console.log("db connected"))

const userModel = new mongoose.Schema({
    username:String,
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    gender: ["Male", "Female"],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
      }],
     bio:String,
     profileImage:String,
     coverImage:String,
     story:String,
     video: String
});

userModel.plugin(plm, {usernameField: 'email'});

module.exports = mongoose.model('user', userModel)