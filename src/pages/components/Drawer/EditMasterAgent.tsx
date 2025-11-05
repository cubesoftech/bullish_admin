import {
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  HStack,
  VStack,
  Text,
  Input,
  DrawerFooter,
  Button,
} from "@chakra-ui/react";
import { Masteragent } from "@/utils/interface";
import { useState } from "react";
import { useSWRConfig } from "swr";
import api from "@/utils/interfaceV2/api";

function EditMasterAgent({
  isOpen,
  onClose,
  masterAgent,
}: {
  isOpen: boolean;
  onClose: () => void;
  masterAgent: Masteragent;
}) {
  const { royalty, member } = masterAgent;
  const { password, email } = member;
  const [payload, setPayload] = useState({
    password: password,
    royalty: royalty ? royalty : 0,
    masterAgentId: masterAgent.id,
    membersId: member.id,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayload({
      ...payload,
      [e.target.name]: e.target.value,
    });
  };
  const { mutate } = useSWRConfig();
  const handleSave = async () => {
    try {
      await api.updateMasterAgent({
        masterAgentId: payload.masterAgentId,
        membersId: payload.membersId,
        password: payload.password,
        royalty: payload.royalty
      })
      await mutate("getMasterAgents");
      onClose();
    } catch (error) {
      onClose();
    }
  };
  return (
    <Drawer isOpen={isOpen} placement="right" size={"md"} onClose={onClose}>
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>비밀번호/요율수정</DrawerHeader>

        <DrawerBody mb={10}>
          <VStack w={"100%"}>
            <HStack w={"100%"}>
              <Text>사용자 아이디 :</Text>
              <Text>{email}</Text>
            </HStack>
            <VStack alignItems={"left"} w={"100%"}>
              <Text>비밀번호 :</Text>
              <Input
                width={"100%"}
                defaultValue={password}
                onChange={(e) => {
                  setPayload({
                    ...payload,
                    password: e.target.value,
                  });
                }}
                value={payload.password}
              />
            </VStack>
            <VStack alignItems={"left"} w={"100%"}>
              <Text>수수료</Text>
              <Input
                width={"100%"}
                value={payload.royalty}
                onChange={(e) => {
                  setPayload({
                    ...payload,
                    royalty: parseInt(e.target.value),
                  });
                }}
                defaultValue={royalty ? royalty : "0"}
                type="number"
              />
            </VStack>
          </VStack>
        </DrawerBody>
        <DrawerFooter>
          <Button
            colorScheme="blue"
            onClick={() => {
              handleSave();
            }}
          >
            저장
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default EditMasterAgent;
