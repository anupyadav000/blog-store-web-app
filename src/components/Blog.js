import { Box, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import AllBlogs from "./AllBlogs";
import UserBlogs from "./UserBlogs";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import CreateBlog from "./CreateBlog";
import Cookies from "js-cookie";

function Blog() {
  const [currentList, setCurrentList] = useState(1);
  const dispatch = useDispatch();
  const handleLogout = () => {
    Cookies.remove("email");
    dispatch({
      type: "SetLoggedIn",
      isLogin: false,
    });
    dispatch({
      type: "SetUser",
      user: {},
    });
    dispatch({
      type: "SetAllBlogs",
      allBlogs: [],
    });
    dispatch({
      type: "SetUserBlogs",
      userBlogs: [],
    });
  };
  return (
    <Box display="flex" flexDirection="column" margin={200}>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        marginBottom={10}
      >
        <h1>Here are all of our blogs listed!</h1>
        <Button onClick={handleLogout} marginLeft={5}>
          <Link to="/">Logout</Link>
        </Button>
      </Box>
      <Box display="flex" flexDirection="row" marginTop={15} marginBottom={0}>
        <Button onClick={() => setCurrentList(1)} marginRight={10}>
          All Blogs
        </Button>
        <Button onClick={() => setCurrentList(2)} marginRight={10}>
          My Blogs
        </Button>
        <Button onClick={() => setCurrentList(3)} marginBottom={20}>
          Create Blog
        </Button>
      </Box>
      <Box>
        {currentList === 1 ? (
          <AllBlogs></AllBlogs>
        ) : currentList === 2 ? (
          <UserBlogs></UserBlogs>
        ) : (
          <CreateBlog></CreateBlog>
        )}
      </Box>
    </Box>
  );
}

export default Blog;
