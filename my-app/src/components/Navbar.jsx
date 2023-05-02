import React, { useContext } from "react";
// import {signOut} from "firebase/auth"
// import { auth } from '../firebase'
// import { AuthContext } from '../context/AuthContext'

const Navbar = () => {
  // const {currentUser} = useContext(AuthContext)

  return (
    <div className="navbar">
      <span className="logo">Lama Chat</span>
      <div className="user">
        <img
          src="https://images.pexels.com/photos/13617132/pexels-photo-13617132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt=""
        />
        <span>Anh Dev</span>
        <button>logout</button>
      </div>
    </div>
  );
};

export default Navbar;
