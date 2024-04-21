import { Box, CircularProgress, Text } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSelector } from "react-redux";
import TestViewCard from "../../molecules/TestView";

const HomePageCard = () => {
  const [test, setTest] = useState([]);
  const [page, setPage] = useState(1);
  const [totalTest, setTotalTest] = useState(null);
  const [likes, setLikes] = useState(false);

  const token = useSelector((state) => state.user?.token);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/post/get-posts?page=${page}&limit=4&sortOrder="desc"`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTest([...test, ...response.data.tests.records]);
      setPage(page + 1);
      console.log("fetcgin...")
      setTotalTest(response.data.tests.totalRecords); // Set total results from response
    } catch (error) {}
  };
  useEffect(() => {
    fetchData();
  }, []);

  
  return (
    <Box className="demo-text" height="100vh">
      <InfiniteScroll
        style={{
          overflowY: "hidden",
        }}
        dataLength={test.length}
        next={fetchData}
        hasMore={test.length !== totalTest}
        loader={
          <Box
            w="100%"
            alignItems="center"
            justifyContent="center"
            display="flex"
            padding="20px"
          >
            <CircularProgress isIndeterminate color="blue" />
          </Box>
        }
        endMessage={
          <Box
            w="100%"
            alignItems="center"
            justifyContent="center"
            display="flex"
            padding="20px"
          >
            <Text color="gray" fontSize="20px">
              .... No more Data ....
            </Text>
          </Box>
        }
      >
        <Box
          display="flex"
          alignItems="center"
          w="100%"
          justifyContent="center"
        >
          <ol>
            {test.map((item, index) => (
              <Box key={index} w="70vh" padding="20px">
                <TestViewCard post={item} likes={likes} setLikes={setLikes}/>
              </Box>
            ))}
          </ol>
        </Box>
      </InfiniteScroll>
    </Box>
  );
};

export default HomePageCard;
