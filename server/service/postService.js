const { replaceSpacesWithPercent20 } = require("../lib/imageService");
const postModel = require("../model/postModel");

const createPost = async (req) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      throw Object.assign(new Error(), {
        name: "BAD_REQUEST",
        message: "All Requried Feilds Are Not Present",
      });
    }
    const userid = req.user._id;
    const postImages = req.files.postImage
      .map((file) => {
        if (file.filename) {
          return replaceSpacesWithPercent20(`/images/${file?.filename}`);
        }
        return null;
      })
      .filter(Boolean);
    const newPost = await postModel.create({
      title,
      owner: userid,
      description,
      postImages,
    });

    return { newPost };
  } catch (error) {
    throw error;
  }
};

const getPostsWithLimitAndPage = async (req) => {
  try {
    const { page, limit, search, sortOrder } = req.query;
    let query = {};
    if (search) {
      const regex = new RegExp(search, "i");
      query.title = { $regex: regex };
    }
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit);

    const sortDirection =
      sortOrder && sortOrder.toLowerCase() === "asc" ? 1 : -1;

    const tests = await postModel
      .find(query)
      .populate("owner", "name email pic")
      .sort({ createdAt: sortDirection })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const totalRecords = await postModel.countDocuments(query);
    const totalPages = Math.ceil(totalRecords / pageSize);

    const test = {
      totalRecords: totalRecords,
      totalPages: totalPages,
      page: page,
      limit: limit,
      records: tests,
    };

    return { test };
  } catch (error) {
    throw error;
  }
};

const likePost=async(req)=>{
  try {
    const userId=req.user._id;
    const postId=req.params.postId;
    const postFound=await postModel.findById(postId);
    if(!postFound){
      throw Object.assign(new Error(),{name:"NOT_FOUND",message:"Post Not Found"})
    }

    const userIndex = postFound.likes.indexOf(userId);

    if (userIndex === -1) {
      postFound.likes.push(userId);
      await postFound.save();

      return {status:1}
    } else {
      postFound.likes.splice(userIndex, 1); 
      await postFound.save(); 
      return {status:0}
    }
  } catch (error) {
    throw error;
  }
}

const addComment=async(req)=>{
 try {
  const {commentBody,postId}=req.body;
  if(!commentBody || !postId){
    throw Object.assign(new Error(),{name:"BAD_REQUEST",message:"Comment Body or Post is not present"})
  }
  const postFound=await postModel.findById(postId)
  if(!postFound){
    throw Object.assign(new Error(),{name:"NOT_FOUND",message:"POST NOT FOUND"})
  }
  postFound.comments.push({user:req.user._id,commentBody})
  await postFound.save();
  return {postFound}
 } catch (error) {
  throw error;
 } 
}

const getSinglePost=async(req)=>{
  try {
    const postId=req.params.postId;
    const postFound=await postModel.findById(postId).populate("likes","name pic").populate("comments.user","name pic").populate("owner","name pic")
    if(!postFound){
      throw Object.assign(new Error(),{name:"NOT_FOUND",message:"Post Not Found"})
    }
    return {postFound}
  } catch (error) {
    throw error;
  }
}

const postService = {
  createPost,
  getPostsWithLimitAndPage,
  likePost,
  addComment,
  getSinglePost
};

module.exports = postService;
