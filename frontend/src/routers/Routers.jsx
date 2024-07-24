import React from "react";
import Home from "../pages/home/Home";
import Chat from "../pages/chat/Chat";
import { Routes, Route, useNavigate } from "react-router-dom";
import Account from "../pages/account/Account";
function Routers(props) {
  return (
    <Routes>
      <Route path="/" exact element={<Home />} />
      <Route path="/chats" element={<Chat />} />
      <Route path="/account/:id" element={<Account />} />
    </Routes>
  );
}

export default Routers;
