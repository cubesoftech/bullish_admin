import React, { useEffect, useMemo } from "react";
import { VStack, Heading, Icon, HStack } from "@chakra-ui/react";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { ArrayUserTransaction, TransactionColumn } from "@/utils/interface";
import axios from "axios";
import MyTable from "../Tables/Transaction";
import { FiHome } from "react-icons/fi";

export default function Withdrawals() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo<ColumnDef<TransactionColumn>[]>(
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
        accessorKey: "bank",
        cell: (info) => info.getValue(),
        footer: "Bank",
      },
      {
        accessorKey: "accountNumber",
        accessorFn: (row) => row.accountNumber,
        header: "Account Number",
        cell: (info) => info.getValue(),
        footer: "Account Number",
      },
      {
        accessorKey: "accountHolder",
        header: "Account Holder",
        cell: (info) => info.getValue(),
        footer: "Account Holder",
      },
      {
        accessorKey: "amount",
        cell: (info) => info.getValue(),
        header: "Amount in KRW",
        footer: "Amount",
      },
      {
        accessorKey: "Date Requested",
        cell: (info) => info.getValue(),
        footer: "Date Requested",
      },
      {
        accessorKey: "status",
        cell: (info) => info.getValue(),
        footer: "Status",
      },
    ],
    []
  );

  const [data, setData] = React.useState<TransactionColumn[]>([]);

  const requestAllWithdrawals = async () => {
    let hasMoreData = true;
    let page = 1;
    const url = `/api/getAllWithdrawals?page=${page}`;
    while (hasMoreData) {
      const res = await axios.get<ArrayUserTransaction>(url);
      let { hasMore, withdrawals } = res.data;
      //clean first the new data by removign the duplicates from the data
      //check if the id is already in the data
      withdrawals.map((withdrawal) => {
        const {
          members: { name, email, bank, accountnumber, accountholder },
          amount,
          createdAt,
          status,
          id,
        } = withdrawal;
        setData((data) => [
          ...data,
          {
            id,
            name,
            email,
            bank,
            accountNumber: accountnumber,
            accountHolder: accountholder,
            amount,
            "Date Requested": createdAt,
            status,
          },
        ]);
      });
      hasMoreData = hasMore;
      page++;
    }
  };

  useEffect(() => {
    requestAllWithdrawals();
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
            as={FiHome}
          />
          <Heading>WITHDRAWALS</Heading>
        </HStack>
      </HStack>
      <MyTable
        pagination={pagination}
        setPagination={setPagination}
        columns={columns}
        data={data}
      />
    </VStack>
  );
}
