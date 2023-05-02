import React from "react";

function Search(props) {
  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          // onKeyDown={handleKey}
          // onChange={(e) => setUsername(e.target.value)}
          // value={username}
        />
      </div>
      {/* {err && <span>User not found!</span>}
    {user && (
      
    )} */}

      <div className="userChat">
        <img
          src="https://images.pexels.com/photos/13617132/pexels-photo-13617132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt=""
        />
        <div className="userChatInfo">
          <span>John</span>
        </div>
      </div>
    </div>
  );
}

export default Search;
