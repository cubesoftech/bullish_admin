import { VStack, Heading, Icon, HStack, Text } from "@chakra-ui/react";
import { GiFamilyTree } from "react-icons/gi";

export default function AUDIT() {
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
          <Heading>AUDIT</Heading>
          <HStack m={5} alignItems={"flex-end"}>
            <Text>Net Income :</Text>
            <Text>1,000,000 KRW</Text>
          </HStack>
          <HStack m={5}>
            <Text>Gross Income :</Text>
            <Text>1,000,000 KRW</Text>
          </HStack>
        </HStack>
      </HStack>
      {/* <TradesTab /> */}
    </VStack>
  );
}
