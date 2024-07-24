import { Box } from "@chakra-ui/layout";
import "./styles.css";
// import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";
import SingleChat from "../components/singlechat/SingleChat";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />;
};

export default Chatbox;
