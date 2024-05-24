import {
  VStack,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  HStack,
  Button,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import useSwr, { mutate } from "swr";
import axios from "axios";
import { useSWRConfig } from "swr";
import AddMasterAgent from "../Drawer/AddMasterAgent";
import { ArrayMasterAgent, Masteragent } from "@/utils/interface";
import SubAgentDrawer from "../Drawer/SubAgentDrawer";

function AgentsTable() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { mutate } = useSWRConfig();

  const [masterAgent, setMasterAgent] = React.useState<ArrayMasterAgent>({
    masteragents: [],
  });

  useSwr(
    "/api/getAllMasterAgents",
    async (url) => {
      const res = await axios.get<ArrayMasterAgent>(url);
      console.log(res.data);
      return res.data;
    },
    {
      onSuccess(data, key, config) {
        setMasterAgent(data);
      },
    }
  );

  return (
    <VStack bgColor={"whiteAlpha.800"} w={"100%"} boxShadow={"lg"} p={5}>
      <Table size={"md"} variant={"striped"} colorScheme="cyan">
        <Thead>
          <Tr>
            <Th>#</Th>
            <Th>이름</Th>
            <Th>닉네임</Th>
            <Th>아이디</Th>
            <Th>추천인코드</Th>
            <Th>비밀번호</Th>
            <Th>요율</Th>
            <Th>하부</Th>
            <Th>수정</Th>
          </Tr>
        </Thead>
        <Tbody>
          {masterAgent.masteragents.map((agent, index) => {
            const { id } = agent;
            return <MasterAgent agent={agent} index={index} />;
          })}
        </Tbody>
      </Table>
      <AddMasterAgent isOpen={isOpen} onClose={onClose} />
      <HStack justifyContent={"flex-end"} w={"100%"}>
        <Button onClick={onOpen} colorScheme="purple">
          마스터 에이전트 추가
        </Button>
      </HStack>
    </VStack>
  );
}

export default AgentsTable;

function MasterAgent({ agent, index }: { agent: Masteragent; index: number }) {
  const { agents, id } = agent;

  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();

  const deleteAgent = async () => {
    const url = "/api/deleteMasterAgent";
    try {
      const res = await axios.post(url, { id });
      mutate("/api/getAllMasterAgents");
      toast({
        title: "Success",
        description: "Agent has been deleted",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error has occured",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };
  //agents is an array of agent under the master agent
  return (
    <Tr key={agent.id}>
      <SubAgentDrawer
        masterAgentId={id}
        agent={agents}
        isOpen={isOpen}
        onClose={onClose}
      />
      <Td>{index + 1}</Td>
      <Td>{agent.member.name}</Td>
      <Td>{agent.member.nickname}</Td>
      <Td>{agent.member.email}</Td>
      <Td>{agent.referralCode}</Td>
      <Td>{agent.member.password}</Td>
      <Td>{agent.royalty} %</Td>
      <Td>{agent.agents.length}</Td>
      <Td>
        <HStack>
          <Button onClick={onOpen} colorScheme="purple" variant={"outline"}>
            하위 에이전트 보기
          </Button>
          <Button
            onClick={deleteAgent}
            colorScheme="orange"
            variant={"outline"}
          >
            삭제
          </Button>
        </HStack>
      </Td>
    </Tr>
  );
}
