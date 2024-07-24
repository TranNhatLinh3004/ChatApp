import React, { useEffect, useRef, useState } from "react";
import "./singlechat.css";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { ChatState } from "../../Context/ChatProvider";
import { Box, Text } from "@chakra-ui/react";
import { Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../../config/ChatLogics";
import ProfileModal from "../../UI/ProfileModal";
import UpdateGroupChatModal from "../UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "../ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const ENDPOINT = "http://localhost:5000";
  // const socketRef = useRef();
  // const selectedChatCompareRef = useRef();
  const { selectedChat, user, notification, setNotification, setSelectedChat } =
    ChatState();
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const toast = useToast();
  const [messages, setMessages] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typing, setTyping] = useState(false);
  const [typingUser, setTypingUser] = useState(null);
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  // console.log(notification, "notification");
  const sendMessage = async (event) => {
    if (event.type === "keydown" && event.key !== "Enter") return;
    event.preventDefault();

    if (!newMessage) {
      toast({
        title: "Có lỗi xảy ra!",
        description: "Vui lòng nhập tin nhắn",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "right",
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/message",
        {
          content: newMessage,
          chatId: selectedChat,
        },
        config
      );

      setNewMessage("");

      socket.emit("new message", data);

      // console.log(messages, "Truoc khi push vao messages");
      setIsTyping(false);
      setTypingUser(null);
      setMessages([...messages, data]);

      // console.log(messages, "Sau khi push vao messages");
    } catch (error) {
      toast({
        title: "Có lỗi xảy ra!",
        description: "Đã xảy ra lỗi khi gửi tin nhắn",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "right",
      });
    }
  };
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/message/${selectedChat._id}`,
        config
      );
      setLoading(true);

      setMessages(data);

      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      if (error.response && error.response.status !== 304) {
        toast({
          title: "Có lỗi xảy ra!",
          description: "Failed to Load the Messages",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  // useEffect(() => {
  //   fetchMessages();
  // }, [messages]);
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", ({ userId }) => {
      setIsTyping(true);
      setTypingUser(userId);
    });
    socket.on("stop typing", ({ userId }) => {
      setIsTyping(false);
      setTypingUser(null);
    });

    // Clean up function
    return () => {
      socket.off("typing");
      socket.off("stop typing");
    };
  }, []);

  // useEffect(() => {
  //   fetchMessages();
  //   selectedChatCompare = selectedChat;
  // }, [selectedChat]);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages();
      socket.emit("join chat", selectedChat._id);
    }
  }, [selectedChat?._id]);
  // useEffect(() => {
  //   socket.on("message received", (newMessageReceived) => {
  //     if (!selectedChat || selectedChat._id !== newMessageReceived.chat._id) {
  //       if (!notification.includes(newMessageReceived)) {
  //         setNotification([newMessageReceived, ...notification]);
  //         setFetchAgain(!fetchAgain);
  //       }
  //     } else {
  //       setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
  //     }
  //   });
  // }, [selectedChat, notification, fetchAgain, setFetchAgain, setNotification]);

  useEffect(() => {
    const handleMessageReceived = (newMessageReceived) => {
      if (!selectedChat || selectedChat._id !== newMessageReceived.chat._id) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages((prevMessages) => [...prevMessages, newMessageReceived]);
      }
    };

    socket.on("message received", handleMessageReceived);

    // Clean up function
    return () => {
      socket.off("message received", handleMessageReceived);
    };
  }, [selectedChat, notification, fetchAgain, setFetchAgain, setNotification]);

  const handleNewMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  // useEffect(() => {
  //   socket.on("new message", handleNewMessage);

  //   // Clean up function
  //   return () => {
  //     socket.off("new message", handleNewMessage);
  //   };
  // }, [socket]);

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", {
        chatId: selectedChat._id,
        userId: user._id,
      });
    }

    let lastTypingTime = new Date().getTime();
    const timerLength = 30000; // Set to 3 seconds
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", {
          chatId: selectedChat._id,
          userId: user._id,
        });
        setTyping(false);
      }
    }, timerLength);
  };

  const comeBack = () => {
    setSelectedChat(null);
  };
  console.log("selectedChat", selectedChat);
  return (
    <div className="singlechat">
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            color={"white"}
          >
            {!selectedChat.isGroupChat ? (
              <>
                <span className="box__arrow" onClick={comeBack}>
                  <i class="fa fa-arrow-left" aria-hidden="true"></i>
                </span>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>
                <span className="box__arrow" onClick={comeBack}>
                  <i class="fa fa-arrow-left" aria-hidden="true"></i>
                </span>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>

          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            backgroundImage={`url("https://images.pexels.com/photos/1741821/pexels-photo-1741821.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")`}
            w="100%"
            h="90%"
            objectFit={"cover"}
            borderRadius="lg"
            backgroundPosition={"center"}
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
                {isTyping &&
                  typingUser !== user._id &&
                  selectedChat.users.some((u) => u._id === typingUser) && (
                    <div
                      style={{
                        display: "flex",
                        padding: "5px 0",
                        background: "transparent",
                        width: "13%",
                        marginLeft: "2%",
                      }}
                    >
                      <Lottie
                        options={defaultOptions}
                        height={30}
                        background={"green"}
                        width={70}
                        style={{
                          marginBottom: 15,
                          marginLeft: 0,
                          background: "green",
                          borderRadius: "40px",
                        }}
                      />{" "}
                    </div>
                  )}
              </div>
            )}

            <FormControl
              onKeyDown={sendMessage}
              id="first-name"
              isRequired
              mt={3}
              style={{
                position: "absolute",
                bottom: "0",
                left: "0",
                width: "100%",
              }}
            >
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
                color={"white"}
              />
              <span className="icon__send" onClick={sendMessage}>
                <i className="fa fa-paper-plane" aria-hidden="true"></i>
              </span>
            </FormControl>
          </Box>
        </>
      ) : (
        <div
          className="singlechat__box"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans" color={"white"}>
            Nhấn vào người dùng để bắt đầu cuộc trò chuyện
          </Text>
        </div>
      )}
    </div>
  );
};

export default SingleChat;
