const errorHandler=require("../lib/utils")
const postService=require("../service/postService");


const createPostController=async(req,res)=>{
    try {
        const response=await postService.createPost(req);
        return res.status(201).json({
            message:"Sucsess",
            post:response.newPost
        })        
    } catch (error) {
        errorHandler(res,error)
    }
}

const getPostWithLimitController=async(req,res)=>{
    try {
        const response=await postService.getPostsWithLimitAndPage(req);
        return res.status(200).json({
            message:"Success",
            tests:response.test
        })
    } catch (error) {
        errorHandler(res,error)
    }
}

const likePostController=async(req,res)=>{
    try {
        const response=await postService.likePost(req);
        return res.status(200).json({
            message:"Success",
            postMessage:response.status
        })
    } catch (error) {
        errorHandler(res,error)
    }
}

const addPostCommentController=async(req,res)=>{
    try {
        const response=await postService.addComment(req);
        return res.status(201).json({
            message:"Success",
            post:response.postFound
        })
    } catch (error) {
        errorHandler(res,error)
    }
}

const getSinglePostController=async(req,res)=>{
    try {
        const response=await postService.getSinglePost(req);
        return res.status(200).json({
            message:"Success",
            post:response.postFound
        })
    } catch (error) {
        errorHandler(res,error)
    }
}

module.exports={createPostController,getPostWithLimitController,likePostController,addPostCommentController,getSinglePostController}