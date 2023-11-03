import { CloseIcon } from '@chakra-ui/icons';
import { Badge, Box ,Text} from '@chakra-ui/react'
import React from 'react'

const UserBadgeItem = ({user, handleFunction}) => {
  return (
    <Box 
        display="inline-block"
        flexWrap="wrap"
        padding="0px 5px"
    >
      <Box
        px={2}
        py={1}
        borderRadius="lg"
        m={1}
        mb={2}
        variant="solid"
        display="flex"
        alignItems="center"
        gap="0.3rem"
        backgroundColor="blue"
        colorScheme="purple"
        cursor="pointer"
        width="100%"
        onClick={handleFunction}
        color="white"
      >
        <Text>{user.name}</Text>
        <CloseIcon fontSize={10} />
      </Box>
    </Box>
  );
};

export default UserBadgeItem