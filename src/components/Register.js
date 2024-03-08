import { Box, Button, Input, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegistrationDone, setIsRegistrationDone] = useState(false);

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);
  };

  const userResponseFacebook = (response) => {
    if (response && response.accessToken !== undefined) {
      registerNewUser(response.id, response.userID);
    }
  };

  const [googleUserResponse, setGoogleUserResponse] = useState([]);

  const googleRegister = useGoogleLogin({
    onSuccess: (userResponse) => setGoogleUserResponse(userResponse),
    onError: (err) =>
      console.log(`Google Authentication failed due to error ${err}`),
  });

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);
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
          setIsRegistrationDone(true);
        })
        .catch((err) =>
          alert(`error occurred in google authentication: ${err}`)
        );
    }
  }, [googleUserResponse]);

  const registerNewUser = (emailGiven, passwordGiven) => {
    const fetchUserByCookiesURL =
      "http://localhost:4000/login?email=" + emailGiven;
    axios
      .get(fetchUserByCookiesURL)
      .then((res) => {
        if (res.status === 200 && res.data.error === undefined) {
          alert(`user already registered, please login!`);
        } else {
          axios
            .post("http://localhost:4000/register", {
              email: emailGiven,
              password: passwordGiven,
            })
            .then((res) => {
              if (res.status === 200 && res.data.error === undefined) {
                setIsRegistrationDone(true);
              } else {
                alert(`registering user failed due to error ${res.data.error}`);
              }
            })
            .catch((err) => {
              alert(`error ocurred in registering user :${err}`);
            })
            .finally(() => {
              console.log("registering user promise completed");
            });
        }
      })
      .catch((err) => {
        alert(`error ocurred in logging with cookies, error::${err}`);
      })
      .finally(() => {
        console.log("logging in for user with cookies- promise completed");
      });
  };

  const handleRegisterSubmit = () => {
    const emailRegularExpression =
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.length < 12 || !emailRegularExpression.test(email)) {
      setError("please provide a valid email (min 12 character)");
      return;
    }
    if (password !== confirmPassword) {
      setError("password not matching");
      return;
    }
    const passwordRegularExpression =
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (password.length < 8 || !passwordRegularExpression.test(password)) {
      setError("please provide a valid password (min 8 character)");
      return;
    }
    if (error.length === 0) {
      registerNewUser(email, password);
    }
  };

  return (
    <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
      {isRegistrationDone ? (
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          marginTop={200}
        >
          <Text>
            congrats! registration done, go ahead to login to dashboard{" "}
          </Text>{" "}
          <Button marginLeft={10}>
            <Link to="/login">Login</Link>
          </Button>{" "}
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" marginTop={200}>
          <h1>register to access sea of blogs! enjoy man , ha ha </h1>
          <Input
            type="email"
            placeholder="email ..."
            name="email"
            value={email}
            onChange={handleEmailChange}
            required={true}
            marginTop={5}
          ></Input>
          <Input
            type="password"
            placeholder="password ..."
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required={true}
            marginTop={5}
          ></Input>
          <Input
            type="password"
            placeholder="confirm password ..."
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required={true}
            marginTop={5}
          ></Input>
          <Text marginTop={5}> {error.length > 0 && error} </Text>
          <Button
            onClick={handleRegisterSubmit}
            marginTop={5}
            marginBottom={10}
          >
            Register
          </Button>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="center"
            marginBottom={10}
          >
            <Button onClick={() => googleRegister()}>
              Register with Google 🚀{" "}
            </Button>
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
              textButton="Register with Facebook"
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Register;
