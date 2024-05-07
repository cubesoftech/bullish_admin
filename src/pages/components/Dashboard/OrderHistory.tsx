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
import { FiHome, FiRotateCcw } from "react-icons/fi";
import OrderHistoryTable from "../Tables/OrderHistoryTable";

export default function OrderHistory() {
    const [pagination, setPagination] = React.useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    const columns = useMemo<ColumnDef<OrderHistoryColumn>[]>(
        () => [
            {
                accessorKey: "name",
                cell: (info) => info.getValue(),
                footer: "Name",
            },
            {
                accessorKey: "balance",
                accessorFn: (row) => row.balance,
                id: "balance",
                cell: (info) => info.getValue(),
                footer: "Current Balance",
            },
            {
                accessorKey: "timeExecuted",
                cell: (info) => info.getValue(),
                footer: "Time Executed",
            },
            {
                accessorKey: "trade",
                accessorFn: (row) => row.trade,
                header: "Trade",
                cell: (info) => info.getValue(),
                footer: "Trade",
            },
            {
                accessorKey: "result",
                accessorFn: (row) => row.result,
                header: "Result",
                cell: (info) => info.getValue(),
            },
            {
                accessorFn: (row) => row.tradeAmount,
                header: "Trade Amount",
                cell: (info) => info.getValue(),
                accessorKey: "tradeAmount",
            },
            {
                accessorFn: (row) => row.tradePNL,
                header: "Trade PNL",
                cell: (info) => info.getValue(),
                accessorKey: "tradePNL",
            },
        ],
        []
    );

    const [data, setData] = React.useState<OrderHistoryColumn[]>([]);

    const requestAllOrderHistory = async () => {
        let hasMoreData = true;
        let page = 1;
        const url = `/api/getAllOrderHistory?page=${page}`;
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
                    <Heading>ORDER HISTORY</Heading>
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
