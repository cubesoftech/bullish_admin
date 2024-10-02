import React, { HTMLProps, useEffect, useMemo } from "react";
import { VStack, Heading, Icon, HStack, useToast, useColorModeValue } from "@chakra-ui/react";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { ArrayUserTransaction, TransactionColumn } from "@/utils/interface";
import axios from "axios";
import MyTable from "../Tables/Transaction";
import { FiTrendingUp } from "react-icons/fi";
import { useAuthentication } from "@/utils/storage";

export default function Deposits() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [rowSelection, setRowSelection] = React.useState({});

  const { role, userId } = useAuthentication();

  const columns = useMemo<ColumnDef<TransactionColumn>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <div className="px-1">
            <IndeterminateCheckbox
              {...{
                checked: row.getIsSelected(),
                disabled: !row.getCanSelect(),
                indeterminate: row.getIsSomeSelected(),
                onChange: row.getToggleSelectedHandler(),
              }}
            />
          </div>
        ),
      },
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
        header: "아이디",
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
        cell: (info) =>
          info.getValue() === "pending"
            ? "대기중"
            : info.getValue() === "completed"
              ? "완료"
              : "취소",
        footer: "Status",
      },
    ],
    []
  );

  if (role === "ADMIN") {
    columns.push({
      accessorKey: "masteragentID",
      header: "총판",
      cell: (info) => info.getValue(),
      footer: "총판",
    });
    columns.push({
      accessorKey: "agentID",
      header: "에이전트",
      cell: (info) => info.getValue(),
      footer: "에이전트",
    });
  }

  if (role === "MASTER_AGENT") {
    columns.push({
      accessorKey: "agentID",
      header: "Agent",
      cell: (info) => info.getValue(),
      footer: "Agent",
    });
  }

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
        if (role === "AGENT" || role === "MASTER_AGENT") {
          if (userId === withdrawal.agentID) {
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
                agentID: withdrawal.agentID,
                masteragentID: withdrawal.masteragentID,
              },
            ]);
          }
        } else {
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
              agentID: withdrawal.agentID,
              masteragentID: withdrawal.masteragentID,
            },
          ]);
        }
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
        bgColor={useColorModeValue("whiteAlpha.800", "gray.700")}
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
          <Heading>입금</Heading>
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
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </VStack>
  );
}

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}
