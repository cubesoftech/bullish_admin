import React, { useEffect, useMemo } from "react";
import { VStack, Heading, Icon, HStack } from "@chakra-ui/react";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { ArrayUser, UserColumn } from "@/utils/interface";
import axios from "axios";
import { FiStar } from "react-icons/fi";
import UserTable from "../Tables/UserTable";

export default function UserManagement() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo<ColumnDef<UserColumn>[]>(
    () => [
      {
        accessorKey: "name",
        cell: (info) => info.getValue(),
        footer: "Name",
      },
      {
        accessorKey: "email",
        accessorFn: (row) => row.email,
        id: "email",
        cell: (info) => info.getValue(),
        footer: "Email",
      },
      {
        accessorKey: "nickname",
        cell: (info) => info.getValue(),
        footer: "Nickname",
      },
      {
        accessorKey: "bank",
        cell: (info) => info.getValue(),
        footer: "Bank",
      },
      {
        accessorKey: "accountnumber",
        accessorFn: (row) => row.accountnumber,
        header: "Account Number",
        cell: (info) => info.getValue(),
        footer: "Account Number",
      },
      {
        accessorKey: "accountholder",
        header: "Account Holder",
        cell: (info) => info.getValue(),
        footer: "Account Holder",
      },
      {
        accessorKey: "balance",
        cell: (info) => info.getValue(),
        header: "Balance (KRW)",
        footer: "Balance",
      },
    ],
    []
  );

  const [data, setData] = React.useState<UserColumn[]>([]);

  const requestAllUsers = async () => {
    let hasMoreData = true;
    let page = 1;
    const url = `/api/getAllUsers?page=${page}`;
    while (hasMoreData) {
      const res = await axios.get<ArrayUser>(url);
      let { hasMore, users } = res.data;
      //clean first the new data by removign the duplicates from the data
      //check if the id is already in the data
      users.map((user) => {
        const {
          id,
          name,
          email,
          bank,
          accountnumber,
          accountholder,
          balance,
          password,
          nickname,
        } = user;
        setData((data) => [
          ...data,
          {
            accountholder,
            accountnumber,
            balance,
            bank,
            email,
            id,
            name,
            nickname,
            password,
          },
        ]);
      });
      hasMoreData = hasMore;
      page++;
    }
  };

  useEffect(() => {
    requestAllUsers();
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
      <UserTable
        pagination={pagination}
        setPagination={setPagination}
        columns={columns}
        data={data}
      />
    </VStack>
  );
}
