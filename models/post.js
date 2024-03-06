const mongoose = require('mongoose');

const postModel = mongoose.Schema({
  postImage: String,
  caption: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  date: {
    type: Number,
    default: Date.now()
 }
});


module.exports = mongoose.model("post", postModel)