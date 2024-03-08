import { Box, Button, Input, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const [isLoginDone, setIsLoginDone] = useState(false);

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);
  };

  const [googleUserResponse, setGoogleUserResponse] = useState([]);

  const googleLogin = useGoogleLogin({
    onSuccess: (userResponse) => setGoogleUserResponse(userResponse),
    onError: (err) =>
      console.log(`Google Authentication failed due to error ${err}`),
  });

  const userResponseFacebook = (response) => {
    if (response && response.accessToken !== undefined) {
      loginNewUser(response.id, response.userID);
    }
  };

  useEffect(() => {
    if (googleUserResponse.access_token !== undefined) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${googleUserResponse.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${googleUserResponse.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          loginNewUser(res.data.email, res.data.id);
        })
        .catch((err) =>
          alert(`error occurred in google authentication: ${err}`)
        );
    }
  }, [googleUserResponse]);

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

  const loginNewUser = async (emailGiven, passwordGiven) => {
    await axios
      .post("http://localhost:4000/login", {
        email: emailGiven,
        password: passwordGiven,
      })
      .then((res) => {
        if (res.status === 200 && res.data.error === undefined) {
          const user = { email: emailGiven };
          dispatch({
            type: "SetUser",
            user: user,
          });
          dispatch({
            type: "SetLoggedIn",
            isLogin: true,
          });
          setIsLoginDone(true);

          Cookies.set("email", emailGiven, { expires: 1 });

          setBlogsData(emailGiven);
        } else {
          alert(`error: :${res.data.error}`);
        }
      })
      .catch((err) => {
        alert(`error ocurred in logging in for user :${err}`);
      })
      .finally(() => {
        console.log("logging in for user promise completed");
      });
  };

  const handleLoginSubmit = () => {
    const emailRegularExpression =
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.length < 12 || !emailRegularExpression.test(email)) {
      setError("please provide a valid email (min 12 character)");
      return;
    } else {
      setError("");
    }

    if (password.length < 8) {
      setError("please provide a valid password (min 8 character)");
      return;
    } else {
      setError("");
    }

    if (error.length === 0) {
      loginNewUser(email, password);
    }
  };

  const isLogin = useSelector((state) => state.isLogin);

  useEffect(() => {
    if (isLogin === true) {
      setIsLoginDone(true);
    }
  }, []);

  return (
    <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
      {" "}
      {isLoginDone ? (
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          marginTop={200}
        >
          <Text>Congrats!, Login Successful !</Text>
          <Button marginLeft={30}>
            <Link to="/blogs">Blogs</Link>
          </Button>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" marginTop={200}>
          <h1>login to access sea of blogs! enjoy man , ha ha </h1>
          <Input
            type="email"
            placeholder="email ..."
            name="email"
            value={email}
            onChange={handleEmailChange}
            required={true}
            marginTop={10}
          ></Input>
          <Input
            type="password"
            placeholder="password ..."
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required={true}
            marginTop={10}
          ></Input>
          <Text marginTop={5}>{error.length > 0 && error}</Text>
          <Button onClick={handleLoginSubmit} marginTop={10} marginBottom={10}>
            Login
          </Button>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            marginBottom={10}
          >
            <Button onClick={() => googleLogin()}>Login with Google 🚀 </Button>
          </Box>
          <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
            <FacebookLogin
              appId="200518769459225"
              autoLoad={false}
              fields="name,email,picture"
              scope="public_profile,user_friends"
              callback={userResponseFacebook}
              icon="fa-facebook"
              version="3.1"
              textButton="Login with Facebook"
            />
          </Box>
        </Box>
      )}{" "}
    </Box>
  );
}

export default Login;
