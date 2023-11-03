import React, { useState } from "react";
import { BellIcon, ChevronDownIcon, EmailIcon } from "@chakra-ui/icons";

import {
  Box,
  Text,
  Tooltip,
  Button,
  MenuButton,
  Menu,
  MenuList,
  Avatar,
  MenuItem,
  MenuDivider,
  Drawer,
  useDisclosure,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  Input,
  useToast,
  Spinner,
  useMediaQuery,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModel from "./ProfileModel";
import { useHistory } from "react-router-dom";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserListItem";
import axios from "axios";
import HelpModal from "./HelpModal";
import { getSender } from "../../config/ChatLogic";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const history = useHistory();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter Something in search",
        status: "warning",
        duration: "1000",
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };



      const { data } = await axios.get(`/api/user?search=${search}`, config);
   
      setLoading(false);
      setSearchResult(data);
      if (data.length == 0) {
        toast({
          title: "User or Email not found",
          status: "error",
          duration: "800",
          isClosable: true,
          position: "top-left",
        });
      }
    } catch (error) {
      toast({
        title: "User or Email not found",
        status: "error",
        duration: "1000",
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

   const [isLargerThan600] = useMediaQuery("(min-width: 700px)");
  return (
    <>
      <Box
        width="100%"
        bg="white"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        padding="0rem 1rem"
      >
        <Tooltip label="Search User to chat" aria-label="A tooltip">
          <Button
            variant="ghost"
            display="flex"
            alignItems="center"
            onClick={onOpen}
          >
            {isLargerThan600 ? (
              <>
                <i class="fa-solid fa-magnifying-glass"></i>
                <Text d={{ base: "none", md: "flex" }} px="2">
                  Search user
                </Text>
              </>
            ) : (
              <i class="fa-solid fa-magnifying-glass"></i>
            )}
          </Button>
        </Tooltip>

        <Text>
          {isLargerThan600 ? (
            <>
              <Text
                display="flex"
                gap="0.5rem"
                justifyContent="center"
                alignItems="center"
              >
                Walky Talky Never disconnecting from your world.
              </Text>
            </>
          ) : (
            <>
              <Text
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
              >
                Walky Talky
              </Text>
            </>
          )}
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge 
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="1.3rem" />
            </MenuButton>
            <MenuList>
              {!notification.length && "No New Messages"}
              {notification.map((notify) => (
                <MenuItem
                  key={notify._id}
                  onClick={() => {
                    setSelectedChat(notify.chat);
                    setNotification(notification.filter((n) => n !== notify));
                  }}
                >
                  {notify.chat.isGroupChat
                    ? `New Message in ${notify.chat.chatName}`
                    : `New Message from ${getSender(user, notify.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar name={user.name} src={user.pic} size="sm" />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem onClick={logOutHandler}>Logout</MenuItem>
              <MenuDivider />
              <HelpModal user={user}>
                <MenuItem>Help</MenuItem>
              </HelpModal>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <Text
            textAlign="center"
            marginTop="0.5rem"
            fontWeight="bold"
            fontSize="1.2rem"
          >
            Search User
          </Text>
          <DrawerBody display="flex" flexDirection="column" gap="1rem">
            <Box display="flex">
              <Input
                placeholder="Search by name or email"
                border="1px solid gold"
                display="flex"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Button onClick={handleSearch} variant="outline">
                GO
              </Button>
            </Box>
            <Box>
              <Box display="flex" width="100%" padding="0.2rem">
                {loadingChat && <Spinner marginLeft="auto" />}
              </Box>
              {loading ? (
                <ChatLoading />
              ) : (
                searchResult?.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
