import { Video, PhoneIcon, InfoIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div className="profile__modal">
      {" "}
      {children ? (
        <span onClick={onOpen}> {children} </span>
      ) : (
        <>
          <IconButton
            d={{ base: "flex" }}
            background={"transparent"}
            icon={<InfoIcon color={"white"} />}
            onClick={onOpen}
            style={{ position: "absolute", top: "10px", right: "10px" }}
          />

          <IconButton
            d={{ base: "flex" }}
            background={"transparent"}
            icon={<PhoneIcon color={"white"} />}
            style={{ position: "absolute", top: "10px", right: "60px" }}
          />
        </>
      )}{" "}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="210px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            Username: {user?.name}{" "}
          </ModalHeader>{" "}
          <ModalCloseButton />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            {/* <Image
              borderRadius="full"
              boxSize="150px"
              src={user?.avatar}
              alt={user?.name}
            />{" "} */}
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user?.email}{" "}
            </Text>{" "}
          </ModalBody>{" "}
          <ModalFooter>
            <Button onClick={onClose} bg={"lightgreen"}>
              {" "}
              Close{" "}
            </Button>{" "}
          </ModalFooter>{" "}
        </ModalContent>{" "}
      </Modal>{" "}
    </div>
  );
};

export default ProfileModal;
