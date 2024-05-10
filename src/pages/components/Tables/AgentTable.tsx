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
} from "@chakra-ui/react";
import React from "react";
import useSwr from "swr";
import axios from "axios";
import { useSWRConfig } from "swr";
import AddMasterAgent from "../Drawer/AddMasterAgent";
import { ArrayMasterAgent, Masteragent } from "@/utils/interface";
import SubAgentDrawer from "../Drawer/SubAgentDrawer";

function AgentsTable() {
  const { isOpen, onClose, onOpen } = useDisclosure();

  const { mutate } = useSWRConfig();

  const {
    isOpen: editIsOpen,
    onClose: editOnClose,
    onOpen: editOnOpen,
  } = useDisclosure();

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
            <Th>Name</Th>
            <Th>Nick Name</Th>
            <Th>Email</Th>
            <Th>Password</Th>
            <Th>Royalty</Th>
            <Th>Total Agents</Th>
            <Th>Action</Th>
          </Tr>
        </Thead>
        <Tbody>
          {masterAgent.masteragents.map((agent, index) => {
            return MasterAgent(
              agent,
              index,
              editIsOpen,
              editOnClose,
              editOnOpen
            );
          })}
        </Tbody>
      </Table>
      <AddMasterAgent isOpen={isOpen} onClose={onClose} />
      <HStack justifyContent={"flex-end"} w={"100%"}>
        <Button onClick={onOpen} colorScheme="purple">
          Add Agent
        </Button>
      </HStack>
    </VStack>
  );
}

export default AgentsTable;

function MasterAgent(
  agent: Masteragent,
  index: number,
  isOpen: boolean,
  onClose: () => void,
  onOpen: () => void
) {
  const { agents } = agent;
  //agents is an array of agent under the master agent
  return (
    <Tr key={agent.id}>
      <SubAgentDrawer agent={agents} isOpen={isOpen} onClose={onClose} />
      <Td>{index + 1}</Td>
      <Td>{agent.member.name}</Td>
      <Td>{agent.member.nickname}</Td>
      <Td>{agent.member.email}</Td>
      <Td>{agent.member.password}</Td>
      <Td>{agent.royalty} %</Td>
      <Td>{agent.agents.length}</Td>
      <Td>
        <HStack>
          <Button onClick={onOpen} colorScheme="purple" variant={"outline"}>
            View Sub Agents
          </Button>
        </HStack>
      </Td>
    </Tr>
  );
}
