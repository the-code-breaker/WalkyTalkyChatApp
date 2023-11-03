import { ViewIcon } from '@chakra-ui/icons';
import { Avatar, Button, IconButton, Modal, ModalBody,
     ModalCloseButton, ModalContent, ModalFooter,
      ModalHeader, ModalOverlay, useDisclosure, Image,Text } from '@chakra-ui/react';

import React from 'react'

const ProfileModel = ({user, children}) => {
      const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          d={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onClose}
        />
      )}

      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center" fontSize="2rem"> {user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" justifyContent="center" flexDir="column" alignItems="center" gap="1rem">
            <Image borderRadius="full" boxSize="150px" src={user.pic} />
            <Text fontSize="2xl">Email: {user.email}</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileModel