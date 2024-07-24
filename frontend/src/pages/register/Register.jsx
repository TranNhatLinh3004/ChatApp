import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory

const Register = () => {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const navigate = useNavigate(); // Initialize useNavigate

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [avatar, setAvatar] = useState();
  const [picLoading, setPicLoading] = useState(false);

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "right",
      });
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
    console.log(name, email, password, avatar);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/user/register",
        {
          name,
          email,
          password,
          avatar,
        },
        config
      );
      console.log(data);
      toast({
        title: "Đăng ký thành công",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "right",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false);
      navigate("/chats"); // Use navigate instead of history.push
    } catch (error) {
      toast({
        title: "Error Occurred!",
        // description: error.response.data.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "rights",
      });
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 3000,
        isClosable: true,
        position: "right",
      });
      setPicLoading(false);
      return;
    }
    console.log("hihi", pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "piyushproj");
      fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setAvatar(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel> Name </FormLabel>{" "}
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />{" "}
      </FormControl>{" "}
      <FormControl id="email" isRequired>
        <FormLabel> Email Address </FormLabel>{" "}
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />{" "}
      </FormControl>{" "}
      <FormControl id="password" isRequired>
        <FormLabel> Password </FormLabel>{" "}
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />{" "}
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {" "}
              {show ? "Hide" : "Show"}{" "}
            </Button>{" "}
          </InputRightElement>{" "}
        </InputGroup>{" "}
      </FormControl>{" "}
      <FormControl id="password" isRequired>
        <FormLabel> Confirm Password </FormLabel>{" "}
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />{" "}
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {" "}
              {show ? "Hide" : "Show"}{" "}
            </Button>{" "}
          </InputRightElement>{" "}
        </InputGroup>{" "}
      </FormControl>{" "}
      <FormControl id="avatar">
        <FormLabel> Upload your Picture </FormLabel>{" "}
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />{" "}
      </FormControl>{" "}
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={picLoading}
      >
        Sign Up{" "}
      </Button>{" "}
    </VStack>
  );
};

export default Register;
