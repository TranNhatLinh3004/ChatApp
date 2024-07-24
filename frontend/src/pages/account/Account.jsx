import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import userIcon from "../../assets/images/user-icon.png";
import "./account.css";
import SideDrawer from "../../UI/sidedrawer/SideDrawer";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
function Account(props) {
  const { selectedChat, user, notification, setNotification } = ChatState();
  const [newAvatar, setNewAvatar] = useState(user?.avatar);
  const handleImageChange = async (e) => {
    // const data = await ImagetoBase64(e.target.files[0]);
    // setNewAvatar(data);
  };
  const [newUsername, setNewUsername] = useState(user?.name);
  const [newEmail, setNewEmail] = useState(user?.email);
  const { id } = useParams();
  useEffect(() => {
    // Gọi API để lấy dữ liệu người dùng từ http://localhost:5000/users/:id
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${id}`);
        if (response.ok) {
          const data = await response.json();
          setNewUsername(data.username);
          setNewEmail(data.email);
          setNewAvatar(data.avatar);
        } else {
          setNewUsername(user.name);
          setNewEmail(user.email);
          setNewAvatar(user.avatar);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
  }); // Chạy lại effect khi id thay đổi

  const handleUpdate = async (e) => {
    e.preventDefault();
    // try {
    //   const response = await fetch(
    //     `http://localhost:5000/api/user/${user._id}`, // Update with the correct user ID
    //     {
    //       method: "PUT",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         newUsername,
    //         newEmail,
    //       }),
    //     }
    //   );

    //   if (response.ok) {
    //     const updatedUserData = await response.json(); // Lấy dữ liệu mới từ response
    //     // dispatch(updateUserInfo(updatedUserData));
    //     localStorage.setItem("userInfo", JSON.stringify(updatedUserData));
    //     // Cập nhật thông tin người dùng trong Redux store
    //     // toast.success("Bạn đã cập nhật thành công.");
    //   } else {
    //     // Handle error response from the server
    //     console.error("Failed to update user");
    //     // toast.error("Failed to update user.");
    //   }
    // } catch (error) {
    //   console.error("Error updating user:", error);
    //   // toast.error("An error occurred while updating user.");
    // }
  };
  return (
    <>
      <SideDrawer />
      <section className="accountInfo">
        <div className="sidebar__account">
          <h3 className="subtitle">TÀI KHOẢN</h3>
          <div className="img flexCenter">
            <img
              src={newAvatar ? newAvatar : userIcon}
              alt="image"
              className="image-preview"
            />
          </div>{" "}
          <input
            placeholder="Chọn ảnh"
            id="file"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />{" "}
          <div className="filter__category"></div>
        </div>

        <div className="wrap_content_account">
          <div className="container boxItems">
            <h5>Hồ Sơ Của Tôi</h5>
            <p>Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
            <div className="content">
              <Box as="form" className="right" onSubmit={handleUpdate}>
                <VStack spacing={4} align="stretch">
                  <FormControl id="username">
                    <FormLabel>Tên đăng nhập</FormLabel>
                    <Input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                    />
                  </FormControl>
                  <FormControl id="email">
                    <FormLabel>Email</FormLabel>
                    <Input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                    />
                  </FormControl>

                  <Button type="submit" colorScheme="blue" w={"80%"}>
                    Cập nhập
                  </Button>
                </VStack>
              </Box>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Account;
