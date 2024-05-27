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
  Select,
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
    status,
  } = user;

  const [userState, setUserState] = useState<UserColumn>(user);

  const toast = useToast();

  const updateUser = async () => {
    const url = "/api/editUser";
    console.log(userState);
    try {
      delete userState.agents;
      delete userState.agentID;
      delete userState.masteragentID;
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
        <DrawerHeader>수정</DrawerHeader>

        <DrawerBody mb={10}>
          <VStack
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={1}
          >
            <VStack justifyContent={"flex-start"} alignItems={"flex-start"}>
              <Text>이름</Text>
              <Input
                onChange={(e) => {
                  setUserState({ ...userState, name: e.target.value });
                }}
                defaultValue={name}
              />
            </VStack>
            <VStack justifyContent={"flex-start"} alignItems={"flex-start"}>
              <Text>아이디</Text>
              <Input
                defaultValue={email}
                onChange={(e) => {
                  setUserState({ ...userState, email: e.target.value });
                }}
              />
            </VStack>
            <VStack justifyContent={"flex-start"} alignItems={"flex-start"}>
              <Text>은행</Text>
              <Input
                defaultValue={bank}
                onChange={(e) => {
                  setUserState({ ...userState, bank: e.target.value });
                }}
              />
            </VStack>
            <VStack justifyContent={"flex-start"} alignItems={"flex-start"}>
              <Text>계좌번호</Text>
              <Input
                onChange={(e) => {
                  setUserState({ ...userState, accountnumber: e.target.value });
                }}
                defaultValue={accountnumber}
              />
            </VStack>
            <VStack justifyContent={"flex-start"} alignItems={"flex-start"}>
              <Text>예금주</Text>
              <Input
                defaultValue={accountholder}
                onChange={(e) => {
                  setUserState({ ...userState, accountholder: e.target.value });
                }}
              />
            </VStack>
            <VStack justifyContent={"flex-start"} alignItems={"flex-start"}>
              <Text>보유자산</Text>
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
              <Text>닉네임</Text>
              <Input
                defaultValue={nickname}
                onChange={(e) => {
                  setUserState({ ...userState, nickname: e.target.value });
                }}
              />
            </VStack>
            <VStack justifyContent={"flex-start"} alignItems={"flex-start"}>
              <Text>비밀번호</Text>
              <Input
                defaultValue={password}
                onChange={(e) => {
                  setUserState({ ...userState, password: e.target.value });
                }}
              />
            </VStack>
            <VStack justifyContent={"flex-start"} alignItems={"flex-start"}>
              <Text>Status</Text>
              <Select
                value={userState.status ? 1 : 0}
                onChange={(e) => {
                  setUserState({
                    ...userState,
                    status: e.target.value === "1" ? true : false,
                  });
                }}
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </Select>
            </VStack>
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            취소
          </Button>
          <Button colorScheme="blue" onClick={updateUser}>
            적용
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default EditUser;
