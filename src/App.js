import { Box } from "@chakra-ui/react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Blog from "./components/Blog";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useEffect } from "react";
import Cookies from "js-cookie";

function App() {
  const dispatch = useDispatch();
  const setBlogsData = (email) => {
    axios
      .get("http://localhost:4000/blog")
      .then((res) => {
        dispatch({
          type: "SetAllBlogs",
          allBlogs: res.data || [],
        });
      })
      .catch((err) => {
        alert(`error ocurred in fetching all blogs :${err}`);
      })
      .finally(() => {
        console.log("fetching all blogs promise completed");
      });

    const fetchUserBlogsUrl =
      "http://localhost:4000/blog/user" + "?email=" + email;
    axios
      .get(fetchUserBlogsUrl)
      .then((res) => {
        dispatch({
          type: "SetUserBlogs",
          userBlogs: res.data,
        });
      })
      .catch((err) => {
        alert(`error ocurred in fetching User blogs :${err}`);
      })
      .finally(() => {
        console.log("fetching User blogs promise completed");
      });
  };

  useEffect(() => {
    const email = Cookies.get("email");
    if (email !== undefined && email.length > 0) {
      const fetchUserByCookiesURL =
        "http://localhost:4000/login?email=" + email;
      axios
        .get(fetchUserByCookiesURL)
        .then((res) => {
          if (res.status === 200 && res.data.error === undefined) {
            const tmpUser = { email: email };
            dispatch({
              type: "SetUser",
              user: tmpUser,
            });
            dispatch({
              type: "SetLoggedIn",
              isLogin: true,
            });
            setBlogsData(email);
          }
        })
        .catch((err) => {
          alert(`error ocurred in logging with cookies, error::${err}`);
        })
        .finally(() => {
          console.log("logging in for user with cookies- promise completed");
        });
    }
  }, []);

  return (
    <Box>
      <BrowserRouter>
        <Box>
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route path="login" element={<Login />}></Route>
            <Route path="register" element={<Register />}></Route>
            <Route path="blogs" element={<Blog />}></Route>
          </Routes>
        </Box>
        <Box>
          <Outlet></Outlet>
        </Box>
      </BrowserRouter>
    </Box>
  );
}

export default App;
