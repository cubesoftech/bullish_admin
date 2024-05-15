import React, { useEffect, useMemo } from "react";
import { VStack, Heading, Icon, HStack } from "@chakra-ui/react";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { ArrayInquiry, InquryColumn } from "@/utils/interface";
import axios from "axios";
import { FiStar } from "react-icons/fi";
import InquiryTable from "../Tables/InquiryTable";

export default function UserManagement() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo<ColumnDef<InquryColumn>[]>(
    () => [
      {
        accessorKey: "title",
        cell: (info) => info.getValue(),
        footer: "Title",
      },
      {
        accessorKey: "email",
        accessorFn: (row) => row.email,
        id: "email",
        cell: (info) => info.getValue(),
        footer: "Email",
      },
      {
        accessorKey: "alreadyAnswered",
        cell: (info) => (info.getValue() ? "Yes" : "No"),
        footer: "Nickname",
      },
      {
        accessorKey: "createdAt",
        cell: (info) => {
          const date = new Date(info.getValue() as string);
          return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        },
        footer: "Bank",
      },
    ],
    []
  );

  const [data, setData] = React.useState<InquryColumn[]>([]);

  const requestInquiries = async () => {
    let hasMoreData = true;
    let page = 1;
    const url = `/api/getAllInquiries?page=${page}`;
    setData([]);
    while (hasMoreData) {
      const res = await axios.get<ArrayInquiry>(url);
      let { hasMore, inquries } = res.data;
      //clean first the new data by removign the duplicates from the data
      //check if the id is already in the data
      inquries.map((inqury) => {
        const {
          id,
          title,
          content,
          answer,
          memberId,
          createdAt,
          updatedAt,
          member,
          alreadyAnswered,
        } = inqury;
        const { email } = member;
        setData((data) => [
          ...data,
          {
            id,
            title,
            content,
            answer,
            memberId,
            createdAt,
            updatedAt,
            email,
            alreadyAnswered,
          },
        ]);
      });
      hasMoreData = hasMore;
      page++;
    }
  };

  useEffect(() => {
    requestInquiries();
  }, []);

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
            as={FiStar}
          />
          <Heading>Inquiry</Heading>
        </HStack>
      </HStack>
      <InquiryTable
        pagination={pagination}
        setPagination={setPagination}
        columns={columns}
        data={data}
      />
    </VStack>
  );
}
