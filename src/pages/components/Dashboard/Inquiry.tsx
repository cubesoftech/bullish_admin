import React, { useEffect, useMemo } from "react";
import { VStack, Heading, Icon, HStack, useColorModeValue } from "@chakra-ui/react";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { ArrayInquiry, InquryColumn } from "@/utils/interface";
import axios from "axios";
import { FiStar } from "react-icons/fi";
import InquiryTable from "../Tables/InquiryTable";
import { useAuthentication } from "@/utils/storage";
import api from "@/utils/interfaceV2/api";

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
        header: "제목",
        footer: "Title",
      },
      {
        accessorKey: "email",
        accessorFn: (row) => row.email,
        id: "email",
        header: "아이디",
        cell: (info) => info.getValue(),
        footer: "Email",
      },
      {
        accessorKey: "alreadyAnswered",
        cell: (info) => (info.getValue() ? "완료" : "대기"),
        footer: "Nickname",
        header: "답변 여부",
      },
      {
        accessorKey: "createdAt",
        header: "생성 날짜",
        cell: (info) => {
          const date = new Date(info.getValue() as string);
          return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
        },
        footer: "Bank",
      },
    ],
    []
  );

  const [refetch, setRefetch] = React.useState(true);

  const [data, setData] = React.useState<InquryColumn[]>([]);

  const { role, userId } = useAuthentication();

  const requestInquiries = async () => {
    let hasMoreData = true;
    let page = 1;
    setData([]);
    while (hasMoreData) {
      const { hasMore, inquries } = await api.getInquiries({
        page,
        filter: "all"
      })
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
          agentID,
          masterAgentID,
        } = inqury;
        const { email } = member;
        if (role === "AGENT" || role === "MASTER_AGENT") {
          if (userId === agentID || userId === masterAgentID) {
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
                agentID,
                masterAgentID,
              },
            ]);
          }
        } else {
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
              agentID,
              masterAgentID,
            },
          ]);
        }
      });
      hasMoreData = hasMore;
      page++;
    }
  };

  useEffect(() => {
    if (refetch) {
      requestInquiries();
      setRefetch(false);
    }
  }, [refetch]);

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
            as={FiStar}
          />
          <Heading>문의</Heading>
        </HStack>
      </HStack>
      <InquiryTable
        pagination={pagination}
        setPagination={setPagination}
        columns={columns}
        data={data}
        refetch={() => setRefetch(true)}
      />
    </VStack>
  );
}
