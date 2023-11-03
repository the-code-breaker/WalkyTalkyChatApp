import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  useToast,
  FormControl,
  Input,
  Stack,
  Box,
  Text,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import UserListItem from '../UserListItem'
import ChatLoading from '../ChatLoading'
import UserBadgeItem from "../UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
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
      // console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (err) {}
  };


  const handleGroup = (userToAdd) => {
      if(selectedUsers.includes(userToAdd)){
          toast({
            title: "User Already Added",
            status: "warning",
            duration: 1000,
            isClosable: true,
            position: "top"
          });
      }else{
        setSelectedUsers([...selectedUsers, userToAdd]);
      }
  };

  const handleSubmit = async() => {
      if(!groupChatName || !selectedUsers){
         toast({
           title: "Please Enter the Group Name",
           status: "warning",
           duration: 1000,
           isClosable: true,
           position: "top",
         });
          return;
      }
        try {
          const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };

          const { data } = await axios.post(
            "/api/chat/group",
            {
              name: groupChatName,
              users: JSON.stringify(selectedUsers.map((u) => u._id)),
            },
            config
          );
          setChats([data, ...chats]);
          onClose();
          toast({
            title: "Group Created SuccessFully",
            status: "success",
            duration: 1000,
            isClosable: true,
            position: "top",
          });
        } catch (error) {
          toast({
            title: "Group Not Created",
            status: "warning",
            duration: 1000,
            isClosable: true,
            position: "top",
          });
        }
  };


  const handleDelete = (userToDelete) => {
      setSelectedUsers(
        selectedUsers.filter((sel) => sel._id !== userToDelete._id)
      );
  }
  
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={1}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Input
                placeholder="Add members to this group"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {selectedUsers.map((u)=>(
                <UserBadgeItem 
                    
                    key={user._id}
                    user={u}
                    handleFunction={()=> handleDelete(u)}
                />
            ))}

            {/* render searched users */}
            {loading? <ChatLoading  /> : (
              searchResult?.slice(0,4).map(user => (
                <UserListItem key={user._id} user={user} handleFunction={()=> handleGroup(user)} />
              ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
