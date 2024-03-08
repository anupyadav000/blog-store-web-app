import { Box, Text, Input } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function AllBlogs() {
  const allBlogs = useSelector((state) => state.allBlogs) || [];
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAllBlogs, setFilteredAllBlogs] = useState(allBlogs);
  const handleFilerAllBlogs = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
    const filterAllBlogsUrl =
      "http://localhost:4000/blog/search" + "?searchQuery=" + value;
    axios
      .get(filterAllBlogsUrl)
      .then((res) => {
        setFilteredAllBlogs(res.data);
      })
      .catch((err) => {
        alert(`error ocurred in filtering all blogs :${err}`);
      })
      .finally(() => {
        console.log("filtering all blogs promise completed");
      });
  };
  return (
    <Box display="flex" flexDirection="column">
      <Input
        type="text"
        placeholder="search ..."
        value={searchQuery}
        onChange={handleFilerAllBlogs}
      ></Input>
      {filteredAllBlogs.map((blog, index) => {
        return (
          <Box
            display="flex"
            flexDirection="column"
            marginBottom={20}
            key={index}
          >
            <hr />
            <Box marginTop={5}>
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
                      <h1>{blog.title}</h1>
                    </td>
                    <td>
                      <p>{blog.content}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

export default AllBlogs;
