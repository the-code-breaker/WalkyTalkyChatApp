import React, {useState, useEffect } from 'react'
import {
  Box,
  Text,
  useToast,
  Button,
  Stack,
  Avatar,
} from "@chakra-ui/react";
import ChatLoading from './ChatLoading';
import { ChatState } from '../Context/ChatProvider';
import axios from 'axios';
import { AddIcon } from '@chakra-ui/icons';
import { getSender } from '../config/ChatLogic';
import GroupChatModal from './miscellaneous/GroupChatModal';

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const toast = useToast();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
     
    } catch (error) {
      toast({
        title: "Error Occured",
        discriptionn: "Failed to load the chats",
        status: "warning",
        duration: "1000",
        isClosable: true,
        position: "top-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      backgroundColor="white"
      w={{ base: "100%", md: "31%" }}
      height="90%"
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display="flex"
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        overflowY="scroll"
        h="100%"
        borderRadius="lg"
      >
        {chats ? (
          <Stack>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                backgroundColor={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Box display="flex" alignItems="center">
                  <Avatar
                    mr={2}
                    size="sm"
                    cursor="pointer"
                    src={chat.users[1].pic}
                  />
                  <Box>
                    <Text>
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </Text>
                    <Text>
                      {!chat.isGroupChat
                        ? getSender(
                            loggedUser,
                            chat.latestMessage
                              ? chat.latestMessage.content
                              : "No Message"
                          )
                        : "Group"}
                    </Text>
                    {/* {} */}
                  </Box>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats