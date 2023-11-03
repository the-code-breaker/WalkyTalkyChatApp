import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfileModel from "./miscellaneous/ProfileModel";
import GroupChatModal from "./miscellaneous/GroupChatModal";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModel";
import ScrollableChat from "./ScrollableChat";
import  io  from "socket.io-client";
const ENDPOINT = "http://localhost:5000";
var socket;
var selectedChatCompare;
import "./style.css";
import axios from 'axios'

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setsocketConnected] = useState(false);
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const toast = useToast();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit('stop typing', selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };


  const sendMessageClick = async (event) => {
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };





   useEffect(() => {
     socket = io(ENDPOINT);
     socket.emit("setup", user);
     socket.on("connected", () => setsocketConnected(true));
     socket.on("typing", () => setIsTyping(true));
     socket.on("stop typing", () => setIsTyping(false));
   }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);


   useEffect(() => {
     socket.on("message recieved", (newMessageRecieved) => {
       if (
         !selectedChatCompare || 
         selectedChatCompare._id !== newMessageRecieved.chat._id
       ) {
         if (!notification.includes(newMessageRecieved)) {
           setNotification([newMessageRecieved, ...notification]);
           setFetchAgain(!fetchAgain);
         }
       } else {
         setMessages([...messages, newMessageRecieved]);
       }
     });
   });

const typingHandler = (e) => {
  setNewMessage(e.target.value);

  if (!socketConnected) return;

  if (!typing) {
    setTyping(true);
    socket.emit("typing", selectedChat._id);
  }
  let lastTypingTime = new Date().getTime();
  var timerLength = 2000;
  setTimeout(() => {
    var timeNow = new Date().getTime();
    var timeDiff = timeNow - lastTypingTime;
    if (timeDiff >= timerLength && typing) {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
    }
  }, timerLength);
};


  return (
    <>
      {selectedChat ? (
        <>
          <Box
            width="100%"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            height="85vh"
            minHeight="100%"
          >
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              pb={3}
              px={2}
              w="100%"
              fontFamily="Wans sans"
              display="flex"
              justifyContent={{ base: "space-between" }}
              alignItems="center"
            >
              <IconButton
                d={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
              />
              {messages &&
                (!selectedChat.isGroupChat ? (
                  <>
                    {getSender(user, selectedChat.users)}
                    <ProfileModel
                      user={getSenderFull(user, selectedChat.users)}
                    />
                  </>
                ) : (
                  <>
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModal
                      fetchMessages={fetchMessages}
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                    />
                  </>
                ))}
            </Text>
            <Box
              d="flex"
              flexDirection="column"
              justifyContent="flex-end"
              p={3}
              bg="#E8E8E8"
              w="100%"
              h="100%"
              borderRadius="lg"
              overflowY="hidden"
            >
              {loading ? (
                <Box
                  display="flex"
                  width="100%"
                  height="100%"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Spinner size="xl" width={20} height={20} />
                </Box>
              ) : (
                <div className="message" style={{ maxHeight: "100%" }}>
                  <ScrollableChat messages={messages} />
                </div>
              )}
            </Box>

            <Box>
              {istyping ? <div>typing...</div> : <></>}
              <FormControl
                onKeyDown={sendMessage}
                id="first-name"
                isRequired
                mt={3}
                display="flex"
              >
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                />
                <Button
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="10%"
                  backgroundColor="#25D366"
                  borderRadius="0px 5px 5px 0px"
                  cursor="pointer"
                  colorScheme="blue"
                  onClick={sendMessageClick}
                >
                  <i
                    class="fa-solid fa-paper-plane"
                    style={{ fontSize: "1.5rem", color: "white" }}
                  ></i>
                </Button>
              </FormControl>
            </Box>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a User to Start Chatting..
          </Text>
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            or Search any user present in database...
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
