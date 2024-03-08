import { Box, Button, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <Box display="flex" flexDirection="column" margin={300}>
      <h1>Welcome to Blog App</h1>
      <Text marginTop={30}>Please login or register to access blogs!</Text>
      <Box marginTop={30}>
        <Button marginRight={30}>
          <Link to="/login">Login</Link>
        </Button>
        <Button>
          <Link to="/register">Register</Link>
        </Button>
      </Box>
    </Box>
  );
}

export default Home;
