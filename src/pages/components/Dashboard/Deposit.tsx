import React, { useEffect, useMemo } from "react";
import { VStack, Heading, Icon, HStack, useToast } from "@chakra-ui/react";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { ArrayUserTransaction, TransactionColumn } from "@/utils/interface";
import axios from "axios";
import MyTable from "../Tables/Transaction";
import { FiTrendingUp } from "react-icons/fi";

export default function Deposits() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo<ColumnDef<TransactionColumn>[]>(
    () => [
      {
        accessorKey: "name",
        cell: (info) => info.getValue(),
        header: "이름",
        footer: "Name",
      },
      {
        accessorKey: "email",
        accessorFn: (row) => row.email,
        id: "email",
        header: "이메일",
        cell: (info) => info.getValue(),
        footer: "Email",
      },
      {
        accessorKey: "bank",
        header: "은행",
        cell: (info) => info.getValue(),
        footer: "Bank",
      },
      {
        accessorKey: "accountNumber",
        header: "계좌 번호",
        accessorFn: (row) => row.accountNumber,
        cell: (info) => info.getValue(),
        footer: "Account Number",
      },
      {
        accessorKey: "accountHolder",
        header: "계좌 주",
        cell: (info) => info.getValue(),
        footer: "Account Holder",
      },
      {
        accessorKey: "amount",
        header: "금액",
        cell: (info) => info.getValue(),
        footer: "Amount in KRW",
      },
      {
        accessorKey: "Date Requested",
        header: "요청 날짜",
        cell: (info) => info.getValue(),
        footer: "Date Requested",
      },
      {
        accessorKey: "status",
        header: "상태",
        cell: (info) => info.getValue(),
        footer: "Status",
      },
    ],
    []
  );

  const [data, setData] = React.useState<TransactionColumn[]>([]);

  const [refetch, setRefetch] = React.useState(true);

  const requestAllWithdrawals = async () => {
    let hasMoreData = true;
    let page = 1;
    setData([]);
    const url = `/api/getAllDeposits?page=${page}`;
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
        let created = new Date(createdAt);
        let created_ = `${created.toDateString()} ${created.toLocaleTimeString()}`;
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
            "Date Requested": created_,
            status,
          },
        ]);
      });
      hasMoreData = hasMore;
      page++;
    }
  };

  const toast = useToast();

  useEffect(() => {
    try {
      if (refetch) {
        requestAllWithdrawals();
        setRefetch(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while fetching data",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
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
        bgColor={"whiteAlpha.800"}
      >
        <HStack justifyContent={"center"}>
          <Icon
            mr="4"
            fontSize="30"
            _groupHover={{
              color: "white",
            }}
            as={FiTrendingUp}
          />
          <Heading>매장</Heading>
        </HStack>
      </HStack>
      <MyTable
        pagination={pagination}
        setPagination={setPagination}
        columns={columns}
        data={data}
        isWithdrawal={false}
        refetch={() => {
          setRefetch(true);
        }}
      />
    </VStack>
  );
}
