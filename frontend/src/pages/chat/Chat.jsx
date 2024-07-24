import React, { useState, useEffect } from "react";
import axios from "axios";
import SideDrawer from "../../UI/sidedrawer/SideDrawer";
import { ChatState } from "../../Context/ChatProvider";
import { Box } from "@chakra-ui/layout";
import ChatBox from "../../UI/ChatBox";
import "./chat.css";
import MyChats from "../../UI/mychats/MyChats";
function Chat(props) {
  const { user } = ChatState();
  const [chats, setChats] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);

  // const fetchChats = async () => {
  //   try {
  //     const response = await axios.get("http://localhost:5000/api/chat");
  //     setChats(response.data);
  //   } catch (error) {
  //     console.error("Error fetching chats:", error);
  //   }
  // };

  // useEffect(() => {
  //   fetchChats();
  // }, [user]);

  return (
    <div className="section__chat" style={{}}>
      <SideDrawer></SideDrawer>

      <Box
        d="flex"
        justifyContent="space-between"
        w="100%"
        h="90vh"
        p="10px"
        className="view__chat"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
}

export default Chat;
