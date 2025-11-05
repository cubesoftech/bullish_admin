import {
  Button,
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useToast,
  VStack,
  Input,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { MasterAgentInterface } from "@/utils/interface";
import { useSWRConfig } from "swr";
import api from "@/utils/interfaceV2/api";

function AddMasterAgent({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [payload, setPayload] = React.useState<MasterAgentInterface>({
    email: "",
    name: "",
    nickname: "",
    password: "",
    royalty: 0,
  });
  const toast = useToast();

  const { mutate } = useSWRConfig();

  const handleSave = async () => {
    //if content is empty and title is empty
    if (
      payload.email === "" &&
      payload.name === "" &&
      payload.nickname === "" &&
      payload.password === ""
    ) {
      toast({
        title: "All fields are required.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    try {
      await api.createMasterAgent({ ...payload })
      onClose();
      mutate("getMasterAgents");
    } catch (error) {
      toast({
        title: "An error occurred.",
        description: "Same userId already exists.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      onClose();
      mutate("getAnnouncement");
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="right" size={"md"} onClose={onClose}>
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>마스터 에이전트 추가</DrawerHeader>

        <DrawerBody mb={10}>
          <VStack spacing={4}>
            <VStack spacing={1} w={"100%"} alignItems={"flex-start"}>
              <Text>이름</Text>
              <Input
                value={payload.name}
                onChange={(e) =>
                  setPayload({ ...payload, name: e.target.value })
                }
                placeholder="Name"
              />
            </VStack>
            <VStack spacing={1} w={"100%"} alignItems={"flex-start"}>
              <Text>아이디</Text>
              <Input
                value={payload.email}
                onChange={(e) =>
                  setPayload({ ...payload, email: e.target.value })
                }
                placeholder="UserId"
              />
            </VStack>
            <VStack spacing={1} w={"100%"} alignItems={"flex-start"}>
              <Text>별명</Text>
              <Input
                value={payload.nickname}
                onChange={(e) =>
                  setPayload({ ...payload, nickname: e.target.value })
                }
                placeholder="Nickname"
              />
            </VStack>
            <VStack spacing={1} w={"100%"} alignItems={"flex-start"}>
              <Text>비밀번호</Text>
              <Input
                value={payload.password}
                onChange={(e) =>
                  setPayload({ ...payload, password: e.target.value })
                }
                placeholder="Password"
              />
            </VStack>
            <VStack spacing={1} w={"100%"} alignItems={"flex-start"}>
              <Text>요율</Text>
              <Input
                type="number"
                value={payload.royalty}
                onChange={(e) =>
                  setPayload({ ...payload, royalty: parseInt(e.target.value) })
                }
                placeholder="Royalty"
              />
            </VStack>
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave} colorScheme="blue">
            승인
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default AddMasterAgent;
