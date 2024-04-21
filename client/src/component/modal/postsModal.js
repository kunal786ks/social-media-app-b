import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Input,
  Box,
  FormControl,
  FormLabel,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";

const PostsModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state?.user?.token);
  const toast = useToast();

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
  };
  const handlePostUpload = async () => {
    if (!title || !description || files.length === 0) {
      toast({
        title: "Error",
        description: "Fill the required Fields",
        status: "error",
        duration: 2000,
        position: "top-left",
        isClosable: true,
      });
      return;
    }
    if (files.length > 10) {
      toast({
        title: "Error",
        description: "Max Image upload limit is 10",
        status: "error",
        duration: 2000,
        position: "top-left",
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      files.forEach((file, index) => {
        formData.append("postImage", file); // Appending each file with the same key
      });

      await axios.post(`http://localhost:8080/api/post/create-post`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      toast({
        title: "Success",
        description: "Your Posts Uploaded Successfully",
        status: "success",
        duration: 5000,
        position: "top-left",
        isClosable: true,
      });
      onClose();
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: error?.response?.data?.message,
        status: "error",
        duration: 5000,
        position: "top-left",
        isClosable: true,
      });
    }
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Your Posts</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box justifyContent="center" alignItems="center" gap="10px">
              <FormControl isRequired>
                <FormLabel>Post Title</FormLabel>
                <Input
                  type="text"
                  placeholder="Enter the title of your post"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)} // Update title state
                />
              </FormControl>
              <FormControl mt="2%" isRequired>
                <FormLabel>Post Description</FormLabel>
                <Textarea
                  placeholder="Enter the description of your post"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} // Update description state
                />
              </FormControl>
              <FormControl mt="2%" isRequired display="flex" flexDir="column">
                <FormLabel>Upload Your Posts</FormLabel>
                <Input
                  type="file"
                  multiple
                  onChange={handleFileChange} // Set handler for file input
                />
              </FormControl>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              bg="rgb(132, 94, 242)"
              _hover={{ bg: "rgb(132, 94, 242)" }}
              color="white"
              mr={3}
              isLoading={loading}
              onClick={handlePostUpload}
            >
              Upload
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PostsModal;
