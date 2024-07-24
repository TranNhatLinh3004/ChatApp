import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Input,
  Box,
  Text,
  Tooltip,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Avatar,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import Lottie from "lottie-react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import { Link, useNavigate } from "react-router-dom";
import ProfileModal from "../ProfileModal";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserListItem";
import NotificationBadge, { Effect } from "react-notification-badge";
import { getSender } from "../../config/ChatLogics";
import axios from "axios";
function SideDrawer() {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();
  const navigate = useNavigate(); // Initialize useNavigate
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notification));
  }, [notification]);

  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        if (Array.isArray(parsedNotifications)) {
          setNotification(parsedNotifications);
        } else {
          console.error("Saved notifications is not an array");
          setNotification([]);
        }
      } catch (error) {
        console.error("Error parsing saved notifications:", error);
        setNotification([]);
      }
    } else {
      setNotification([]);
    }
  }, [setNotification]);

  const logoutHandler = () => {
    setSelectedChat("");
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  console.log(user);
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/chat`,
        { userId },
        config
      );
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "right-left",
      });
      setLoadingChat(false);
    }
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Vui lòng nhập tên hoặc gmail",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "right",
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
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "bottom-left",
      });
      setLoading(false);
    }
  };

  const clearValue = () => {
    setSearch("");
  };

  return (
    <div className="section__header">
      <Box w="100%" p="5px 10px 5px 10px" className="box__header">
        <Tooltip
          // label="Search Users to chat"
          hasArrow
          placement="bottom-end"
          w="50%"
        >
          <Button className="btn__search" variant="ghost" onClick={onOpen}>
            <i className="fas fa-search" style={{ color: "white" }}></i>
            <Text d={{ base: "none", md: "flex" }} px={4} color="white">
              Tìm kiếm
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontSize="4xl"
          fontFamily="Work sans"
          w="16%"
          color="white"
          className="logo"
        >
          <Link to={`/chats`}> Let's Chat</Link>
        </Text>
        <div
          className="profile__notification"
          style={{ width: "10%", background: "" }}
        >
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} color="white" />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && (
                <p style={{ color: "black" }}>Không có tin nhắn mới</p>
              )}
              {Array.from(
                new Set(
                  notification.map((notif) =>
                    notif.chat.isGroupChat
                      ? notif.chat.chatName
                      : getSender(user, notif.chat.users)
                  )
                )
              ).map((uniqueNotif) => {
                const notifCount = notification.filter((n) =>
                  n.chat.isGroupChat
                    ? n.chat.chatName === uniqueNotif
                    : getSender(user, n.chat.users) === uniqueNotif
                ).length;

                return (
                  <MenuItem
                    key={uniqueNotif}
                    onClick={() => {
                      // Find all notifications related to the selected chat
                      const relevantNotifs = notification.filter((n) =>
                        n.chat.isGroupChat
                          ? n.chat.chatName === uniqueNotif
                          : getSender(user, n.chat.users) === uniqueNotif
                      );

                      if (relevantNotifs.length > 0) {
                        // Set the selected chat to the relevant chat
                        setSelectedChat(relevantNotifs[0].chat);

                        // Remove all notifications related to the selected chat
                        setNotification(
                          notification.filter((n) =>
                            n.chat.isGroupChat
                              ? n.chat.chatName !== uniqueNotif
                              : getSender(user, n.chat.users) !== uniqueNotif
                          )
                        );
                      }
                    }}
                  >
                    {uniqueNotif.startsWith("New Message in")
                      ? uniqueNotif
                      : `Tin nhắn mới từ ${uniqueNotif}`}{" "}
                    ({notifCount})
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              bg="grey"
              color="white"
              p={3}
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user?.name}
                src={user?.avatar}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>
                  <Link to={`/account/${user?._id}`}>Tài khoản của tôi</Link>
                </MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Đăng xuất</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Tìm kiếm</DrawerHeader>
          <DrawerBody>
            <Box
              d="flex"
              pb={2}
              justifyContent="center"
              alignItems="center"
              position="relative"
              style={{
                display: "flex",
              }}
            >
              <Input
                placeholder="Nhập tên & email"
                mr={2}
                value={search}
                w="70%"
                position="relative"
                border="1px solid #50B498"
                // background={"grey"}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <span
                  style={{
                    height: "40px",
                    width: "40px",
                    backgroundColor: "transparent",
                    position: "absolute",
                    right: "35%",
                    top: "0%",
                    cursor: "pointer",
                    zIndex: "10",
                    fontSize: "25px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onClick={clearValue}
                >
                  &times;
                </span>
              )}
              <Button onClick={handleSearch} bg="#50B498">
                Tìm kiếm
              </Button>
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
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default SideDrawer;
