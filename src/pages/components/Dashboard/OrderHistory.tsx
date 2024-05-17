import React, { useEffect, useMemo } from "react";
import { VStack, Heading, Icon, HStack, Text } from "@chakra-ui/react";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import {
  ArrayOrderHistory,
  OrderHistoryColumnInterface,
} from "@/utils/interface";
import axios from "axios";
import { FiRotateCcw } from "react-icons/fi";
import OrderHistoryTable from "../Tables/OrderHistoryTable";
import { useAuthentication } from "@/utils/storage";

export default function OrderHistory() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { role, id } = useAuthentication();
  console.log(role, id);
  const columns = useMemo<ColumnDef<OrderHistoryColumnInterface>[]>(
    () => [
      {
        accessorKey: "email",
        cell: (info) => info.getValue(),
        header: "이메일",
        footer: "Email",
      },
      {
        accessorKey: "balance",
        accessorFn: (row) => row.balance,
        id: "balance",
        header: "잔액",
        cell: (info) => info.getValue(),
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
          ) : (
            <Text color={"red"}>쇼트</Text>
          ),
      },
      {
        accessorFn: (row) => row.tradeAmount,
        header: "거래 금액",
        cell: (info) => info.getValue(),
        accessorKey: "tradeAmount",
      },
      {
        accessorFn: (row) => row.tradePNL,
        header: "거래 PNL",
        cell: (info) => info.getValue(),
        accessorKey: "tradePNL",
      },
    ],
    []
  );

  const [data, setData] = React.useState<OrderHistoryColumnInterface[]>([]);

  const requestAllOrderHistory = async () => {
    let hasMoreData = true;
    let page = 1;
    const url = `/api/getAllOrderHistory?page=${page}&id=${id}&role=${role}`;
    while (hasMoreData) {
      const res = await axios.get<ArrayOrderHistory>(url);
      let { hasMore, orderHistory } = res.data;
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
        } = history;
        const { balance, name, bank, email, nickname } = members;
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
            result,
            tradeAmount,
            tradePNL,
            type,
          },
        ]);
      });
      hasMoreData = hasMore;
      page++;
    }
  };

  useEffect(() => {
    requestAllOrderHistory();
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
      />
    </VStack>
  );
}
