import React, { HTMLProps, useEffect, useMemo } from "react";
import { VStack, Heading, Icon, HStack, Text, useColorModeValue, Switch, Stack, useInterval } from "@chakra-ui/react";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import {
  ArrayOrderHistory,
  OrderHistoryColumnInterface,
} from "@/utils/interface";
import axios from "axios";
import { FiRotateCcw } from "react-icons/fi";
import OrderHistoryTable from "../Tables/OrderHistoryTable";
import { useAuthentication } from "@/utils/storage";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import api from "@/utils/interfaceV2/api";

interface Filter {
  realUser: boolean;
  tester: boolean;
  setRealUser: (realUser: boolean) => void;
  setTester: (tester: boolean) => void
}

export const useFilter = create<Filter>()(
  persist<Filter>(
    (set) => ({
      realUser: true,
      tester: true,
      setRealUser: (realUser: boolean) => set({ realUser }),
      setTester: (tester: boolean) => set({ tester })
    }),
    {
      name: "filter-storage",
      storage: createJSONStorage(() => localStorage)
    }
  )
)

export default function OrderHistory() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { role, id, userId } = useAuthentication();
  const [rowSelection, setRowSelection] = React.useState({});
  const { realUser, tester } = useFilter()
  const columns = useMemo<ColumnDef<OrderHistoryColumnInterface>[]>(
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
        accessorKey: "email",
        cell: (info) => info.getValue(),
        header: "아이디",
        footer: "Email",
      },
      {
        accessorKey: "name",
        cell: (info) => info.getValue(),
        header: "이름",
        footer: "Name",
      },
      {
        accessorKey: "type",
        header: "타입",
        cell: (info) => info.getValue(),
        footer: "Type",
      },
      {
        accessorKey: "balance",
        accessorFn: (row) => row.balance,
        id: "balance",
        header: "잔액",
        cell: (info: any) => info.getValue().toLocaleString(),
        footer: "Current Balance",
      },
      {
        accessorKey: "timeExecuted",
        header: "주문 시간",
        cell: (info) => info.getValue(),
        footer: "Time Executed",
      },
      {
        accessorKey: "trade",
        accessorFn: (row) => row.trade,
        header: "거래",
        cell: (info) =>
          info.getValue() === "LONG" ? (
            <Text color={"green"}>롱</Text>
          ) : (
            <Text color={"red"}>쇼트</Text>
          ),
        footer: "Trade",
      },
      {
        accessorKey: "result",
        accessorFn: (row) => row.result,
        header: "결과",
        cell: (info) =>
          info.getValue() === "LONG" ? (
            <Text color={"green"}>롱</Text>
          ) : info.getValue() === "SHORT" ? (
            <Text color={"red"}>쇼트</Text>
          ) : (
            ""
          ),
      },
      {
        accessorFn: (row) => row.tradeAmount,
        header: "거래 금액",
        cell: (info: any) => info.getValue().toLocaleString(),
        accessorKey: "tradeAmount",
      },
      {
        accessorFn: (row) => row.tradePNL,
        header: "거래 PNL",
        cell: (info: any) => info.getValue().toLocaleString(),
        accessorKey: "tradePNL",
      },
    ],
    []
  );

  const [data, setData] = React.useState<OrderHistoryColumnInterface[]>([]);

  const [refetch, setRefetch] = React.useState(true);

  const requestAllOrderHistory = async () => {
    setData([]);
    let hasMoreData = true;
    let page = 1;
    while (hasMoreData) {
      const { hasMore, orderHistory } = await api.getTradeHistory({
        page,
        id,
        role
      })
      //clean first the new data by removign the duplicates from the data
      //check if the id is already in the data
      orderHistory.map((history) => {
        let {
          id,
          members,
          membersId,
          timeExecuted,
          trade,
          tradeAmount,
          tradePNL,
          type,
          remainingBalance,
          origTradeAmount
        } = history;
        const { balance, name, bank, email, nickname, agentsId, agentID } = members;
        if (!tester && email.includes("test")) {
          return;
        }
        if (!realUser && !email.includes("test")) {
          console.log("real")
          return;
        }
        const tradeResult = trade ? "LONG" : "SHORT";
        const result =
          tradePNL > 0
            ? tradeResult
            : tradeResult === "LONG"
              ? "SHORT"
              : "LONG";
        const executed = new Date(timeExecuted);
        setData((data) => [
          ...data,
          {
            id,
            timeExecuted: `${executed.toLocaleDateString()} ${executed.toLocaleTimeString()}`,
            balance,
            email,
            membersId,
            name,
            nickname,
            trade: tradeResult,
            result: tradePNL === 0 ? "" : result,
            tradeAmount,
            tradePNL,
            type,
            remainingBalance,
            origTradeAmount
          },
        ]);
      });
      hasMoreData = hasMore;
      page++;
    }
  };

  useEffect(() => {
    if (refetch) {
      try {
        requestAllOrderHistory();
        setRefetch(false);
      } catch (error) {
        console.error(error);
      }
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
            as={FiRotateCcw}
          />
          <Heading>주문 내역</Heading>
        </HStack>
      </HStack>
      <OrderHistoryTable
        pagination={pagination}
        setPagination={setPagination}
        columns={columns}
        data={data}
        rowSelection={rowSelection}
        setRefetch={setRefetch}
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
