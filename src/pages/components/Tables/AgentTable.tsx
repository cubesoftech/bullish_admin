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
import { useAuthentication } from "@/utils/storage";
import EditMasterAgent from "../Drawer/EditMasterAgent";

function AgentsTable() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { role, id } = useAuthentication();
  const { mutate } = useSWRConfig();

  const [masterAgent, setMasterAgent] = React.useState<ArrayMasterAgent>({
    masteragents: [],
  });

  useSwr(
    "/api/getAllMasterAgents",
    async (url) => {
      const res = await axios.get<ArrayMasterAgent>(url);
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
            {/* <Th>추천인코드</Th> */}
            <Th>비밀번호</Th>
            <Th>요율</Th>
            <Th>하부</Th>
            <Th>수정</Th>
          </Tr>
        </Thead>
        <Tbody>
          {masterAgent.masteragents.map((agent, index) => {
            if (role === "MASTER_AGENT" && agent.memberId === id) {
              return <MasterAgent agent={agent} index={index} />;
            }
            if (role === "ADMIN") {
              return <MasterAgent agent={agent} index={index} />;
            }
          })}
        </Tbody>
      </Table>
      <AddMasterAgent isOpen={isOpen} onClose={onClose} />
      {role === "ADMIN" && (
        <HStack justifyContent={"flex-end"} w={"100%"}>
          <Button onClick={onOpen} colorScheme="purple">
            마스터 에이전트 추가
          </Button>
        </HStack>
      )}
    </VStack>
  );
}

export default AgentsTable;

function MasterAgent({ agent, index }: { agent: Masteragent; index: number }) {
  const { agents, id, member } = agent;

  const { status, id: membersId } = member;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const masterAgentEdit = useDisclosure();
  const toast = useToast();
  const { role } = useAuthentication();

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

  const activateMasterAgent = async () => {
    const url = "/api/activateMasterAgent";
    try {
      const res = await axios.post(url, { id: membersId, status: !status });
      mutate("/api/getAllMasterAgents");
      toast({
        title: "Success",
        description: "Agent has been activated",
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

  return (
    <Tr color={status ? "black" : "red"} key={agent.id}>
      <SubAgentDrawer
        masterAgentId={id}
        masterMemberName={agent.member.email}
        agent={agents}
        isOpen={isOpen}
        onClose={onClose}
      />
      <EditMasterAgent {...masterAgentEdit} masterAgent={agent} />
      <Td>{index + 1}</Td>
      <Td>{agent.member.name}</Td>
      <Td>{agent.member.nickname}</Td>
      <Td>{agent.member.email}</Td>
      {/* <Td>{agent.referralCode}</Td> */}
      <Td>{agent.member.password}</Td>
      <Td>{agent.royalty} %</Td>
      <Td>{agent.agents.length - 1}</Td>
      <Td>
        <HStack>
          <Button
            onClick={onOpen}
            size={"sm"}
            colorScheme="purple"
            variant={"outline"}
            isDisabled={status ? false : true}
          >
            하위 에이전트 보기
          </Button>
          {role === "ADMIN" && (
            <HStack>
              <Button
                size={"sm"}
                onClick={activateMasterAgent}
                colorScheme={status ? "red" : "green"}
                variant={"outline"}
              >
                {status ? "비활성" : "활성"}
              </Button>
              <Button
                size={"sm"}
                onClick={masterAgentEdit.onOpen}
                colorScheme={status ? "red" : "green"}
                variant={"outline"}
                isDisabled={status ? false : true}
              >
                수정
              </Button>
            </HStack>
          )}
        </HStack>
      </Td>
    </Tr>
  );
}
