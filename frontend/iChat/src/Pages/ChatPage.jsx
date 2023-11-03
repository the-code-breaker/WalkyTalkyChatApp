import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import SideDrawer from '../components/miscellaneous/SideDrawer';
import {
  Box, useMediaQuery,
} from "@chakra-ui/react";

import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';

const ChatPage = () => {

  const {user}  = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false)
   const [isLargerThan600] = useMediaQuery("(min-width: 700px)");

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}

      {isLargerThan600 ? (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-end"
            flexWrap="wrap-reverse"
            width="100%"
            height="100vh"
            padding="10px"
          >
            {user && <MyChats fetchAgain={fetchAgain} />}
            {user && (
              <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            )}
          </Box>
        </>
      ) : (
        <>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            gap="1rem"
            flexWrap="wrap"
            width="100%"
            height="100vh"
            padding="10px"
          >
            {user && <MyChats fetchAgain={fetchAgain} />}
            {user && (
              <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            )}
          </Box>
        </>
      )}
    </div>
  );
}

export default ChatPage