import React, { useEffect, useMemo } from "react";
import {
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
  Flex,
  VStack,
  Heading,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import {
  ArrayOrderHistory,
  ArrayUserTransaction,
  OrderHistoryColumn,
  TransactionColumn,
  UserTransaction,
} from "@/utils/interface";
import axios from "axios";
import MyTable from "../Tables/Transaction";
import { IconType } from "react-icons";
import { FiHome, FiRotateCcw, FiMessageSquare } from "react-icons/fi";
import { TfiAnnouncement } from "react-icons/tfi";
import AnnouncementTable from "../Tables/AnnouncementTable";

export default function Inquiry() {
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
            as={FiMessageSquare}
          />
          <Heading>INQUIRY</Heading>
        </HStack>
      </HStack>
      <AnnouncementTable />
    </VStack>
  );
}
