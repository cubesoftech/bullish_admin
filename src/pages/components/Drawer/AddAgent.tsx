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
import { AgentInterface } from "@/utils/interface";
import { useSWRConfig } from "swr";

function AddAgent({
  isOpen,
  onClose,
  masterAgentId,
}: {
  isOpen: boolean;
  onClose: () => void;
  masterAgentId: string;
}) {
  const [payload, setPayload] = React.useState<AgentInterface>({
    email: "",
    name: "",
    nickname: "",
    password: "",
    royalty: 0,
    masterAgentId: masterAgentId,
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
    const url = "/api/addAgent";
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        toast({
          title: "MasterAgent created.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        onClose();
        mutate("/api/getAllMasterAgents");
      })
      .catch((error) => {
        toast({
          title: "An error occurred.",
          description: error,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        onClose();
        mutate("/api/getAllAnnouncement");
      });
  };

  return (
    <Drawer isOpen={isOpen} placement="left" size={"md"} onClose={onClose}>
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>에이전트 추가</DrawerHeader>

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
              <Text>이메일</Text>
              <Input
                value={payload.email}
                onChange={(e) =>
                  setPayload({ ...payload, email: e.target.value })
                }
                placeholder="UserID"
              />
            </VStack>
            <VStack spacing={1} w={"100%"} alignItems={"flex-start"}>
              <Text>건강 상태</Text>
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
              <Text>왕족</Text>
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
            구하다
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default AddAgent;
