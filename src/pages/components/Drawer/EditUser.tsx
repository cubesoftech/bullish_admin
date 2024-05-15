import {
  Button,
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  VStack,
  Text,
  Input,
  useToast,
} from "@chakra-ui/react";
import { UserColumn } from "@/utils/interface";
import { useState } from "react";
import axios from "axios";

function EditUser({
  isOpen,
  onClose,
  user,
  refetch,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: UserColumn;
  refetch: () => void;
}) {
  const {
    accountholder,
    accountnumber,
    balance,
    bank,
    email,
    id,
    name,
    nickname,
    password,
  } = user;

  const [userState, setUserState] = useState<UserColumn>(user);

  const toast = useToast();

  const updateUser = async () => {
    const url = "/api/editUser";
    try {
      await axios.post(url, userState);
      toast({
        title: "User Updated",
        description: "User has been updated",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "An error has occured",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return (
    <Drawer isOpen={isOpen} placement="right" size={"md"} onClose={onClose}>
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>수정하다 User</DrawerHeader>

        <DrawerBody mb={10}>
          <VStack
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={1}
          >
            <VStack justifyContent={"flex-start"} alignItems={"flex-start"}>
              <Text>Name</Text>
              <Input
                onChange={(e) => {
                  setUserState({ ...userState, name: e.target.value });
                }}
                defaultValue={name}
              />
            </VStack>
            <VStack justifyContent={"flex-start"} alignItems={"flex-start"}>
              <Text>Email</Text>
              <Input
                defaultValue={email}
                onChange={(e) => {
                  setUserState({ ...userState, email: e.target.value });
                }}
              />
            </VStack>
            <VStack justifyContent={"flex-start"} alignItems={"flex-start"}>
              <Text>Bank</Text>
              <Input
                defaultValue={bank}
                onChange={(e) => {
                  setUserState({ ...userState, bank: e.target.value });
                }}
              />
            </VStack>
            <VStack justifyContent={"flex-start"} alignItems={"flex-start"}>
              <Text>Account Number</Text>
              <Input
                onChange={(e) => {
                  setUserState({ ...userState, accountnumber: e.target.value });
                }}
                defaultValue={accountnumber}
              />
            </VStack>
            <VStack justifyContent={"flex-start"} alignItems={"flex-start"}>
              <Text>Account Holder</Text>
              <Input
                defaultValue={accountholder}
                onChange={(e) => {
                  setUserState({ ...userState, accountholder: e.target.value });
                }}
              />
            </VStack>
            <VStack justifyContent={"flex-start"} alignItems={"flex-start"}>
              <Text>Balance</Text>
              <Input
                defaultValue={balance}
                type="number"
                onChange={(e) => {
                  setUserState({
                    ...userState,
                    balance: parseInt(e.target.value),
                  });
                }}
              />
            </VStack>
            <VStack justifyContent={"flex-start"} alignItems={"flex-start"}>
              <Text>Nickname</Text>
              <Input
                defaultValue={nickname}
                onChange={(e) => {
                  setUserState({ ...userState, nickname: e.target.value });
                }}
              />
            </VStack>
            <VStack justifyContent={"flex-start"} alignItems={"flex-start"}>
              <Text>Password</Text>
              <Input
                defaultValue={password}
                onChange={(e) => {
                  setUserState({ ...userState, password: e.target.value });
                }}
              />
            </VStack>
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={updateUser}>
            Update
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default EditUser;
