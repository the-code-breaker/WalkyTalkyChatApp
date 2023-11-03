import React, { useEffect } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Container,
  Box,
  Text,
  Input,
  TabList,
  Tab,
  Tabs,
  TabPanel,
  TabPanels,
  useHighlight,
  Image,
} from "@chakra-ui/react";

import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/Signup";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import logo from "../assets/img/logo.png"

const HomePage = () => {

  const history = useHistory();
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if(user){
      history.push("/chats");
    }
  },[history])
  
  return (
    <Container maxWidth="xl" centerContent>
      <Box
        d={"flex"}
        justifyContent={"center"}
        p={3}
        w={"100%"}
        bg={"white"}
        m={"40px 0 15px 0"}
        borderRadius={"lg"}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-around"
          width="100%"
        >
          <Box
            boxSize="100px"
            objectFit="cover"
            src="https://bit.ly/dan-abramov"
            alt="Dan Abramov"
          >
            <Image src={logo} alt="Dan Abramov" />
          </Box>
          <Text
            fontSize="4xl"
            color="tomato"
            fontFamily="wan sans"
            // textAlign={"center"}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            
          >
            Welcome to Walky Talky
            <Text fontSize="sm" color="grey">Never disconnecting from your world.</Text>
          </Text>
        </Box>
      </Box>

      <Box w={"100%"} borderRadius={"lg"} p={4} borderWidth={5} bg={"white"}>
        <Tabs variant="soft-rounded">
          <TabList display={"flex"} justifyContent={"space-around"}>
            <Tab w={"50%"}>Login</Tab>
            <Tab w={"50%"}>Sign up</Tab>
          </TabList>
          <TabPanels display={"flex"} justifyContent={"center"}>
            <TabPanel w={"100%"}>
              <Login />
            </TabPanel>
            <TabPanel w={"100%"}>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
