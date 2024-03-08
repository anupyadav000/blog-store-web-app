import { Box, Button, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import axios from "axios";

function CreateBlog() {
  const user = useSelector((state) => state.user);
  const [title, SetTitle] = useState("");
  const [content, SetContent] = useState("");
  const dispatch = useDispatch();
  const [isBlogAdded, setIsBlogAdded] = useState(false);

  const handleTitleChange = (e) => {
    const { value } = e.target;
    SetTitle(value);
  };

  const handleContentChange = (e) => {
    const { value } = e.target;
    SetContent(value);
  };

  const handleAddBlog = () => {
    const blog = {
      title: title,
      content: content,
      email: user.email,
    };
    axios
      .post("http://localhost:4000/blog", blog)
      .then((res) => {
        if (res.data.error === undefined && res.status === 200) {
          setIsBlogAdded(true);
          dispatch({
            type: "AddInAllBlogs",
            blog: res.data,
          });
          dispatch({
            type: "AddInUserBlogs",
            blog: res.data,
          });
        } else {
          alert(`error ocurred in creating user blog :${res.data.error}`);
        }
      })
      .catch((err) => {
        alert(`error ocurred in creating user blog :${err}`);
      })
      .finally(() => {
        console.log("create user blog promise completed");
      });
  };

  return (
    <Box>
      {isBlogAdded ? (
        <Box display="flex" flexDirection="row" alignItems="center">
          <Text>Congrats, Blog Added!</Text>
          <Button onClick={() => setIsBlogAdded(false)} marginLeft={5}>
            Add More
          </Button>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column">
          <Input
            type="text"
            required={true}
            value={title}
            placeholder="title ..."
            onChange={handleTitleChange}
            marginBottom={5}
          ></Input>
          <Input
            type="text"
            required={true}
            value={content}
            placeholder="content ..."
            onChange={handleContentChange}
            marginBottom={5}
          ></Input>
          <Button onClick={handleAddBlog}>Add Blog</Button>
        </Box>
      )}
    </Box>
  );
}

export default CreateBlog;
