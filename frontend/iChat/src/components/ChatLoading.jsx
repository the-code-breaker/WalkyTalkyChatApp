import { Skeleton, SkeletonCircle, Stack } from '@chakra-ui/react';
import React from 'react'

const ChatLoading = () => {
  return (
    <Stack>
      <SkeletonCircle size="10" />
      <Skeleton height="20px" />
      <SkeletonCircle size="10" />
      <Skeleton height="20px" />
      <SkeletonCircle size="10" />
      <Skeleton height="20px" />
      <SkeletonCircle size="10" />
      <Skeleton height="20px" />
      <SkeletonCircle size="10" />
      <Skeleton height="20px" />
    </Stack>
  );
}

export default ChatLoading