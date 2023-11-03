import React from 'react'
import {
  Box,
  Text,
  Input,
} from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import SingleChat from './SingleChat';

const ChatBox = ({fetchAgain, setFetchAgain}) => {
  const { seletedChat } = ChatState();
  return (
    <Box
      display="flex"
      alignItems="center"
      flexDirection="column"
      overflow="hidden"
      p={3}
      bg="white"
      height="90%"
      width={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
      justifyContent="center"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
}

export default ChatBox