import { Box, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import UserBlog from "./UserBlog";
import axios from "axios";
import { useDispatch } from "react-redux";

function UserBlogs() {
  const userBlogs = useSelector((state) => state.userBlogs) || [];
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user) || {};
  const [searchQuery, setSearchQuery] = useState("");
  const handleFilerUserBlogs = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
    const filterAllBlogsUrl =
      "http://localhost:4000/blog/search/user" +
      "?searchQuery=" +
      value +
      "&email=" +
      user.email;
    axios
      .get(filterAllBlogsUrl)
      .then((res) => {
        dispatch({
          type: "SetUserBlogs",
          userBlogs: res.data,
        });
      })
      .catch((err) => {
        alert(`error ocurred in filtering my blogs :${err}`);
      })
      .finally(() => {
        console.log("filtering my blogs promise completed");
      });
  };
  return (
    <Box display="flex" flexDirection="column">
      <Input
        type="text"
        placeholder="search ..."
        value={searchQuery}
        onChange={handleFilerUserBlogs}
      ></Input>
      {userBlogs.map((blog, index) => {
        return <UserBlog userBlog={blog} key={index}></UserBlog>;
      })}
    </Box>
  );
}

export default UserBlogs;
