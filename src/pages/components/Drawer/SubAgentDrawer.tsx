import { Agent } from "@/utils/interface";
import {
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  VStack,
  DrawerFooter,
  Button,
  Table,
  Tbody,
  Th,
  Thead,
  Tr,
  Td,
  useDisclosure,
} from "@chakra-ui/react";
import AddAgent from "./AddAgent";
import { useEffect, useState } from "react";

function SubAgentDrawer({
  isOpen,
  onClose,
  agent,
  masterAgentId,
  masterMemberName,
}: {
  isOpen: boolean;
  onClose: () => void;
  agent: Agent[];
  masterAgentId: string;
  masterMemberName: string;
}) {
  const [agentDetails, setAgentDetails] = useState(agent);

  useEffect(() => {
    setAgentDetails(() => {
      return agent.filter((e) => e.member.email !== masterMemberName);
    });
  }, [masterMemberName]);
  const {
    isOpen: agentIsOpen,
    onClose: agentOnClose,
    onOpen: agentOnOpen,
  } = useDisclosure();
  return (
    <Drawer isOpen={isOpen} placement="bottom" size={"xs"} onClose={onClose}>
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Agents</DrawerHeader>

        <DrawerBody mb={10}>
          <VStack
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={1}
          >
            <Table size={"sm"} variant={"striped"} colorScheme="cyan">
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>이름</Th>
                  {/* <Th>추천인코드</Th> */}
                  <Th>아이디</Th>
                  <Th>비밀번호</Th>
                  <Th>요율</Th>
                  <Th>보유회원수</Th>
                </Tr>
              </Thead>
              <Tbody>
                {agentDetails.map((agent, index) => {
                  return (
                    <Tr key={agent.id}>
                      <Td>{index + 1}</Td>
                      <Td>{agent.member.name}</Td>
                      {/* <Td>{agent.referralCode}</Td> */}
                      <Td>{agent.member.email}</Td>
                      <Td>{agent.member.password}</Td>
                      <Td>{agent.royalty} %</Td>
                      <Td>{agent.referredmembers.length}</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </VStack>
        </DrawerBody>
        <AddAgent
          isOpen={agentIsOpen}
          masterAgentId={masterAgentId}
          onClose={agentOnClose}
        />

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            취소
          </Button>
          <Button
            colorScheme="green"
            variant="outline"
            mr={3}
            onClick={agentOnOpen}
          >
            에이전트 추가
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default SubAgentDrawer;
