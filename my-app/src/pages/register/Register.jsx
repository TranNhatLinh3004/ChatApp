import React from "react";
import "./register.css";
import Avatar from "../../img/addAvatar.png";
import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Lama Chat</span>
        <span className="title">Register</span>
        <form>
          <input type="text" placeholder="display name" />
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <input style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file">
            <img src={Avatar} alt="" />
            <span>Add an avatar</span>
          </label>
          <button>Sign up</button>
        </form>
        <p>{/* You do have an account? <Link to="/register">Login</Link> */}</p>
      </div>
    </div>
  );
}

export default Register;
