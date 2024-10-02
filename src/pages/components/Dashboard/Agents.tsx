import { VStack, Heading, Icon, HStack, useColorModeValue } from "@chakra-ui/react";
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
        bgColor={useColorModeValue("whiteAlpha.800", "gray.700")}
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
          <Heading>마스터 에이전트</Heading>
        </HStack>
      </HStack>
      <AgentsTable />
    </VStack>
  );
}
