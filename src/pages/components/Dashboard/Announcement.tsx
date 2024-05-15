import { VStack, Heading, Icon, HStack } from "@chakra-ui/react";
import { TfiAnnouncement } from "react-icons/tfi";
import AnnouncementTable from "../Tables/AnnouncementTable";

export default function Announcement() {
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
            as={TfiAnnouncement}
          />
          <Heading>공지사항</Heading>
        </HStack>
      </HStack>
      <AnnouncementTable />
    </VStack>
  );
}
