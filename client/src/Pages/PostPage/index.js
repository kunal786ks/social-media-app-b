import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
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
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import CommentIcon from "@mui/icons-material/Comment";
import SendIcon from "@mui/icons-material/Send";
const PostPage = () => {
  const [post, setPost] = useState();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comment, setComment] = useState("");
  const [toggle, setToggle] = useState(false);
  const totalImages = post?.postImages?.length || 0;
  const postId = useSelector((state) => state?.post?.postId);
  const token = useSelector((state) => state?.user?.token);
  const toast = useToast();

  const fetchPost = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/post/get-post/${postId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPost(res?.data?.post);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(post, "this is selecte");
  useEffect(() => {
    fetchPost();
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [toggle]);
  const nextImage = () => {
    setCurrentImageIndex((index) => (index + 1) % totalImages);
  };

  const prevImage = () => {
    setCurrentImageIndex((index) => (index - 1 + totalImages) % totalImages);
  };

  const currentImage = post?.postImages?.[currentImageIndex];

  const handleComment = async () => {
    if (!comment) {
      toast({
        description: "Comment is Empty",
        status: "error",
        duration: 2000,
        position: "top-left",
        isClosable: true,
      });
      return;
    }
    try {
      await axios.post(
        `http://localhost:8080/api/post/add-comment`,
        {
          postId: postId,
          commentBody: comment,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setToggle(!toggle);
      setComment("");
      toast({
        description: "Comment added Successfully",
        status: "success",
        duration: 2000,
        position: "top-left",
        isClosable: true,
      });
    } catch (error) {
      toast({
        description: error?.response?.data?.message,
        status: "error",
        duration: 2000,
        position: "top-left",
        isClosable: true,
      });
    }
    setComment("");
  };
  return (
    <Box display="flex" h="92vh">
      <Box
        w="30%"
        display="flex"
        flexDir="column"
        bg="rgb(237, 237, 240)"
        padding="20px"
        overflow="hidden"
        overflowY="scroll"
      >
        <Text fontSize="25px" fontWeight="bold" textAlign="center">
          Post
        </Text>
        <Card mt="8%">
          <CardHeader>
            <Flex spacing="4">
              <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                <Avatar
                  size="lg"
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
                      ? post?.title.charAt(0).toUpperCase() +
                        post?.title?.slice(1)
                      : "Title"}
                  </Text>
                </Box>
              </Flex>
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
          ></CardFooter>
        </Card>
      </Box>

      <Box
        w="30%"
        display="flex"
        flexDir="column"
        bg="rgb(249, 249, 255)"
        padding="20px"
        justifyContent="space-between"
      >
        <Text fontSize="25px" fontWeight="bold" textAlign="center">
          Liked By
        </Text>
        <Box
          h="92%"
          bg="rgb(255, 255, 255)"
          borderRadius="12px"
          overflow="hidden"
          overflowY="scroll"
          padding="20px"
        >
          {post?.likes?.map((like) => {
            return (
              <Box
                display="flex"
                gap="20px"
                mt="2%"
                bg="rgb(228, 228, 233)"
                h="12%"
                alignItems="center"
                padding="10px"
                borderRadius="10px"
              >
                <Avatar
                  size="lg"
                  alt={like?.name}
                  src={`${process.env.REACT_APP_API_HOST_KEY}${like?.pic}`}
                  objectFit="contain"
                />
                <Box>
                  <Text fontSize="20px" textColor="gray">
                    {like?.name.charAt(0).toUpperCase() + like?.name?.slice(1)}
                  </Text>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>

      <Box
        w="40%"
        display="flex"
        flexDir="column"
        bg="rgb(247, 246, 255)"
        padding="20px"
        justifyContent="space-between"
      >
        <Text fontSize="25px" fontWeight="bold" textAlign="center">
          Add Your Comment
        </Text>

        <Box
          h="81%"
          bg="white"
          borderRadius="12px"
          overflow="hidden"
          overflowY="scroll"
          padding="20px"
        >
          {post?.comments?.map((comment) => {
            return (
              <Box
                display="flex"
                gap="20px"
                bg="rgb(223, 237, 255)"
                h="15%"
                alignItems="center"
                padding="20px"
                borderRadius="12px"
                mt="1%"
              >
                <Avatar
                  size="lg"
                  alt={comment?.user?.name}
                  src={`${process.env.REACT_APP_API_HOST_KEY}${comment?.user?.pic}`}
                />
                <Box>
                  <Text fontSize="20px" color="gray">
                    {comment?.user?.name.charAt(0).toUpperCase() +
                      comment?.user?.name?.slice(1)}
                  </Text>
                  <Text fontSize="15px" color="gray">
                    {comment?.commentBody}
                  </Text>
                </Box>
              </Box>
            );
          })}
        </Box>
        <Box h="6%" bg="rgb(221, 221, 226)" borderRadius="12px">
          <InputGroup size="lg">
            <InputLeftElement pointerEvents="none">
              <CommentIcon htmlColor="rgb(156, 128, 238)" />
            </InputLeftElement>
            <Input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add Your Comment"
            />
            <InputRightElement cursor="pointer">
              <SendIcon htmlColor="rgb(132, 94, 242)" onClick={handleComment} />
            </InputRightElement>
          </InputGroup>
        </Box>
      </Box>
    </Box>
  );
};

export default PostPage;
