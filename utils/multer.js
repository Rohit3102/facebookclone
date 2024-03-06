const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file , cd){
        console.log(file);
        cd(null, "./public/images/uploads")
    },
    filename: function(req, file, cd){
         let modifiedName = 
         file.fieldname + Date.now() + '-' + path.extname(file.originalname);
         cd(null, modifiedName);
    },
});
  
  const upload = multer({ storage: storage });

  module.exports = upload;