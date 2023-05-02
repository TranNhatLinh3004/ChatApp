import React from "react";

function Message(props) {
  return (
    <div
      // ref={ref}
      // className={`message ${message.senderId === currentUser.uid && "owner"}`}
      className="message"
    >
      <div className="messageInfo">
        <img
          src="https://images.pexels.com/photos/13617132/pexels-photo-13617132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          // src={
          //   message.senderId === currentUser.uid
          //     ? currentUser.photoURL
          //     : data.user.photoURL
          // }
          alt=""
        />
        <span>just now</span>
      </div>
      <div className="messageContent">
        <p>LLLLLLLLL</p>
        {/* {message.img && <img src={message.img} alt="" />} */}
      </div>
    </div>
  );
}

export default Message;
