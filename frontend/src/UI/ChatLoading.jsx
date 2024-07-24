import { Stack } from "@chakra-ui/layout";
import { Skeleton } from "@chakra-ui/skeleton";

// const ChatLoading = () => {
//   return (
//     <Stack>
//       <Skeleton height="45px" />
//       <Skeleton height="45px" />
//       <Skeleton height="45px" />
//       <Skeleton height="45px" />
//       <Skeleton height="45px" />
//       <Skeleton height="45px" />
//       <Skeleton height="45px" />
//       <Skeleton height="45px" />
//       <Skeleton height="45px" />
//       <Skeleton height="45px" />
//       <Skeleton height="45px" />
//       <Skeleton height="45px" />
//     </Stack>
//   );
// };

// export default ChatLoading;

import React from "react";

function ChatLoading(props) {
  return (
    <Stack>
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
    </Stack>
  );
}

export default ChatLoading;
