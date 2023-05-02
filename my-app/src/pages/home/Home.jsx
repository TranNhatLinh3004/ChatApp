import React from "react";
import "./home.css";
import Sidebar from "../../components/Sidebar";
import Chat from "../../components/Chat";
function Home(props) {
  return (
    <div>
      <div className="home">
        <div className="container">
          <Sidebar />
          <Chat />
        </div>
      </div>
    </div>
  );
}

export default Home;
