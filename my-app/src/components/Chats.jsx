import React from "react";

function Chats(props) {
  return (
    <div className="chats">
      <div className="userChat">
        <img
          src="https://images.pexels.com/photos/13617132/pexels-photo-13617132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt=""
        />
        <div className="userChatInfo">
          <span>John</span>
          <p>Hello</p>
        </div>
      </div>
      {/*  */}
      <div className="userChat">
        <img
          src="https://images.pexels.com/photos/13617132/pexels-photo-13617132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt=""
        />
        <div className="userChatInfo">
          <span>John</span>
          <p>Hello</p>
        </div>
      </div>
      {/*  */}
      <div className="userChat">
        <img
          src="https://images.pexels.com/photos/13617132/pexels-photo-13617132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt=""
        />
        <div className="userChatInfo">
          <span>John</span>
          <p>Hello</p>
        </div>
      </div>
    </div>
  );
}

export default Chats;
