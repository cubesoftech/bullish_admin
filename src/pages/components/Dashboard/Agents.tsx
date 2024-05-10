import { VStack, Heading, Icon, HStack } from "@chakra-ui/react";
import { GiFamilyTree } from "react-icons/gi";
import AgentsTable from "../Tables/AgentTable";

export default function Agents() {
  return (
    <VStack spacing={5}>
      <HStack
        alignItems={"flex-end"}
        h={"10vh"}
        justifyContent={"flex-start"}
        w={"100%"}
        p={5}
        boxShadow={"lg"}
        bgColor={"whiteAlpha.800"}
      >
        <HStack justifyContent={"center"}>
          <Icon
            mr="4"
            fontSize="30"
            _groupHover={{
              color: "white",
            }}
            as={GiFamilyTree}
          />
          <Heading>Master Agents</Heading>
        </HStack>
      </HStack>
      <AgentsTable />
    </VStack>
  );
}
