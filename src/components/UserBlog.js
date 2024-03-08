import { Box, Button } from "@chakra-ui/react";
import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

function UserBlog(props) {
  const userBlog = props.userBlog;
  const userBlogs = useSelector((state) => state.userBlogs) || [];
  const allBlogs = useSelector((state) => state.allBlogs) || [];

  const dispatch = useDispatch();

  const handleDeleteUserBlog = () => {
    const deleteUserBlogsUrl =
      "http://localhost:4000/blog" + "?id=" + userBlog._id;
    axios
      .delete(deleteUserBlogsUrl)
      .then((res) => {
        if (res.status === 200 && res.data.error === undefined) {
          const filteredAllBlogs = allBlogs.filter((blog) => {
            return blog._id !== userBlog._id;
          });
          dispatch({
            type: "SetAllBlogs",
            allBlogs: filteredAllBlogs,
          });
          const filteredUserBlogs = userBlogs.filter((blog) => {
            return blog._id !== userBlog._id;
          });
          dispatch({
            type: "SetUserBlogs",
            userBlogs: filteredUserBlogs,
          });
        } else {
          alert(`something went wrong in deleting User blog`);
        }
      })
      .catch((err) => {
        alert(`error ocurred in deleting User blog :${err}`);
      })
      .finally(() => {
        console.log("deleting User blog promise completed");
      });
  };
  return (
    <Box display="flex" flexDirection="column" marginTop={10}>
      <table>
        <thead>
          <tr>
            {" "}
            <td>Title: </td>
            <td>Content:</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <h1>{userBlog.title}</h1>
            </td>
            <td>
              <p>{userBlog.content}</p>
            </td>
          </tr>
        </tbody>
      </table>
      <Button onClick={handleDeleteUserBlog} marginTop={3}>
        Delete Blog
      </Button>
    </Box>
  );
}

export default UserBlog;
