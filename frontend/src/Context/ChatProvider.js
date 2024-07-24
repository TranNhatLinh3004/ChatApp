import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState();
  const [showDiv, setShowDiv] = useState(true); // Add showDiv state

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) navigate("/"); // Use navigate instead of history.push
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  useEffect(() => {
    const saveNotification = JSON.parse(localStorage.getItem("notification"));
    if (saveNotification) {
      setNotification(saveNotification);
    }
  }, [setNotification]);
  const handleBackButtonClick = () => {
    setSelectedChat(""); // Set selectedChat to empty string
    setShowDiv(false); // Hide the div
  };
  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        showDiv,
        setShowDiv,
        handleBackButtonClick,
      }}
    >
      {children}{" "}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
