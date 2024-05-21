import { VStack, Heading, Icon, HStack } from "@chakra-ui/react";
import { GiFamilyTree } from "react-icons/gi";
import TradesTab from "../Tables/TradesTab";

export default function Trades() {
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
          <Heading>답안지</Heading>
        </HStack>
      </HStack>
      <TradesTab />
    </VStack>
  );
}
