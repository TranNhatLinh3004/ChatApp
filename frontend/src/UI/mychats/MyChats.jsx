import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../../config/ChatLogics";
import { Button } from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import ChatLoading from "../ChatLoading";
import GroupChatModal from "../../components/GroupChatModal";
import { Avatar } from "@chakra-ui/avatar";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();

  const toast = useToast();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:5000/api/chat",
        config
      );
      setChats(data);
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra!",
        description: "Có lỗi xảy ra!",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  const handleChatClick = (chat) => {
    setSelectedChat(chat);

    // Remove notification for the selected chat
    setNotification(
      notification.filter((n) =>
        n.chat.isGroupChat
          ? n.chat.chatName !== chat.chatName
          : getSender(user, n.chat.users) !== getSender(user, chat.users)
      )
    );
  };

  return (
    <div className="section__chats">
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
        className="box__chats"
      >
        <p
          className="title__chats"
          style={{
            color: "white",
          }}
        >
          Đoạn chat
        </p>
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            Tạo nhóm chat{" "}
          </Button>{" "}
        </GroupChatModal>{" "}
      </Box>{" "}
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="rgb(32 34 37)"
        w="100%"
        h="100%"
        overflowY="hidden"
        className="box__users"
        style={{
          position: "relative",
          top: "60px",
        }}
      >
        {chats ? (
          <Stack overflowY="scroll" h="95%">
            {chats.map((chat) => (
              <Box
                onClick={() => handleChatClick(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "grey" : "rgb(32 34 37)"}
                color={selectedChat === chat ? "white" : "white"}
                px={3}
                py={2}
                key={chat._id}
                boxShadow={"lg"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "50px",
                  borderRadius: "20px",
                }}
              >
                <Avatar
                  mr={2}
                  size="sm"
                  cursor="pointer"
                  name={chat.name}
                  src={chat.avatar}
                />{" "}
                <div
                  className="div"
                  style={{
                    display: "flex",
                    alignItems: "start",
                    flexDirection: "column",
                    marginLeft: "10px",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "18px",
                    }}
                  >
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}{" "}
                  </Text>{" "}
                  {chat.latestMessage && (
                    <Text
                      fontSize="xs"
                      color={selectedChat === chat ? "white" : "gray"}
                    >
                      <b> {chat.latestMessage.sender.name}: </b>{" "}
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}{" "}
                    </Text>
                  )}{" "}
                </div>
              </Box>
            ))}{" "}
          </Stack>
        ) : (
          <ChatLoading />
        )}{" "}
      </Box>{" "}
    </div>
  );
};

export default MyChats;
