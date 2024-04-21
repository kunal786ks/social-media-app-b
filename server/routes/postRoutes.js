const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createPostController,
  getPostWithLimitController,
  likePostController,
  addPostCommentController,
  getSinglePostController,
} = require("../controllers/postController");
const { multipleUploads } = require("../config/multerService");

const router = express.Router();

router.post("/create-post", multipleUploads, protect, createPostController);
router.post("/post-likes/:postId", protect, likePostController);
router.post("/add-comment", protect, addPostCommentController);

router.get("/get-posts", protect, getPostWithLimitController);
router.get("/get-post/:postId",protect,getSinglePostController)


module.exports = router;
