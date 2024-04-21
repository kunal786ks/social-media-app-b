const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  description: {
    type: String,
    required: true,
  },
  postImages: {
    type: [String], 
    default: ["/images/default.jpg"],
  },
  likes: {
    type: [mongoose.Schema.Types.ObjectId], 
    ref: "User",
    default: [], 
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
      },
      commentBody: {
        type: String,
        required: true, 
      },
    },
  ],
},{timestamps:true});

const postModel = mongoose.model("Post", postSchema);

module.exports = postModel;
