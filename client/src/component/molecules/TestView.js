import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CommentIcon from "@mui/icons-material/Comment";
import SendIcon from "@mui/icons-material/Send";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectPost, selectTest } from "../../feature/test_user/testSlice";

const TestViewCard = ({ post, likes, setLikes }) => {
  console.log(post, "thi");

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const totalImages = post?.postImages?.length || 0;
  const [liked, setLiked] = useState(0);

  const checkLiked = () => {
    const userIndex = post.likes.indexOf(userId);
    if (userIndex === -1) {
      setLiked(0);
    } else {
      setLiked(1);
    }
  };

  useEffect(() => {
    checkLiked();
  }, [post.likes]);

  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.user?.token);
  const userId = useSelector((state) => state?.user?.userData?._id);

  const likeUnlikePost = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/post/post-likes/${post._id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLikes(!likes);
      setLiked(res?.data?.postMessage);
      toast({
        title: "Success",
        description: "Liked Updated Successfully refresh to see ",
        status: "success",
        duration: 2000,
        position: "top-left",
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message,
        status: "error",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
    }
  };
  const nextImage = () => {
    setCurrentImageIndex((index) => (index + 1) % totalImages);
  };

  const prevImage = () => {
    setCurrentImageIndex((index) => (index - 1 + totalImages) % totalImages);
  };

  const currentImage = post?.postImages?.[currentImageIndex];
  const handleComment = () => {
    dispatch(selectPost(post?._id));
    navigate("/home/post");
  };
  return (
    <Card bg="rgb(204, 204, 204)" w="70vh">
      <CardHeader>
        <Flex spacing="4">
          <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
            <Avatar
              name={post?.owner?.name}
              src={`${process.env.REACT_APP_API_HOST_KEY}${post?.owner?.pic}`}
            />

            <Box>
              <Heading size="sm">
                {post?.owner?.name
                  ? post?.owner?.name.charAt(0).toUpperCase() +
                    post?.owner?.name.slice(1)
                  : "User"}
              </Heading>
              <Text>
                {post?.title
                  ? post?.title.charAt(0).toUpperCase() + post?.title?.slice(1)
                  : "Title"}
              </Text>
            </Box>
          </Flex>
          <IconButton
            variant="ghost"
            colorScheme="gray"
            aria-label="See menu"
            icon={<MoreVertIcon />}
          />
        </Flex>
      </CardHeader>
      <CardBody>
        <Text>
          {post?.description
            ? post?.description.charAt(0).toUpperCase() +
              post?.description.slice(1)
            : "Post Description"}
        </Text>
      </CardBody>
      {totalImages > 0 && (
        <Box
          position="relative"
          display="flex"
          justifyContent="center"
          bg="rgb(238, 238, 240)"
        >
          <Image
            objectFit="cover"
            src={`${process.env.REACT_APP_API_HOST_KEY}${currentImage}`}
            alt={`Image ${currentImageIndex + 1} of ${totalImages}`}
          />
          <Flex
            position="absolute"
            top="10px"
            right="10px"
            color="white"
            fontSize="sm"
          >
            {currentImageIndex + 1}/{totalImages}
          </Flex>
          {totalImages > 1 && (
            <>
              <Text
                onClick={prevImage}
                position="absolute"
                left="10px"
                top="50%"
                cursor="pointer"
              >
                <ArrowBackIosIcon sx={{ fontSize: "40px" }} />
              </Text>
              <Text
                onClick={nextImage}
                position="absolute"
                cursor="pointer"
                right="10px"
                top="50%"
              >
                <ArrowForwardIosIcon sx={{ fontSize: "40px" }} />
              </Text>
            </>
          )}
        </Box>
      )}

      <CardFooter
        justify="space-between"
        flexWrap="wrap"
        sx={{
          "& > button": {
            minW: "136px",
          },
        }}
      >
        <Button
          flex="1"
          variant="ghost"
          onClick={likeUnlikePost}
          leftIcon={liked === 1 ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        >
          {liked === 1 ? `${post.likes.length} Likes` : `${post.likes.length} Likes`}
        </Button>
        <Button
          flex="1"
          variant="ghost"
          leftIcon={<CommentIcon />}
          onClick={handleComment}
        >
          {post?.comments?.length} Comments
        </Button>
        <Button flex="1" variant="ghost" leftIcon={<SendIcon />}>
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TestViewCard;
