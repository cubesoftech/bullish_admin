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
    Text,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Select,
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
import { FiCompass, FiHome, FiRotateCcw } from "react-icons/fi";
import OrderHistoryTable from "../Tables/OrderHistoryTable";

export default function GameSetting() {
    return (
        <VStack spacing={5}>
            <HStack
                alignItems={"flex-end"}
                minH={"10vh"}
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
                        as={FiCompass}
                    />
                    <Heading>GAME SETTINGS</Heading>
                </HStack>
            </HStack>
            <Setting />
        </VStack>
    );
}

const Setting = () => {
    return (
        <VStack
            alignItems={"flex-start"}
            minH={"60vh"}
            justifyContent={"flex-start"}
            w={"100%"}
            p={5}
            boxShadow={"lg"}
            bgColor={"whiteAlpha.800"}
            spacing={5}
        >
            <HStack
                spacing={10}
                justifyContent={"space-around"}
                alignItems={"flex-start"}
            >
                <GameReturnSetting />
                <BetDeadlineSetting />
                <TradingStatus />
                <BalanceSetting />
            </HStack>
        </VStack>
    );
};

const GameReturnSetting = () => {
    return (
        <VStack
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={10}
        >
            <Text fontWeight={"bold"}>Return on Win</Text>
            <NumberInput defaultValue={1.97}>
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
        </VStack>
    );
};

const BetDeadlineSetting = () => {
    const tradingTime = [
        "1 Minute Trading",
        "2 Minutes Trading",
        "3 Minutes Trading",
    ];
    return (
        <VStack alignItems={"flex-start"} spacing={7}>
            <Text fontWeight={"bold"}>Return on Win</Text>
            {tradingTime.map((time) => {
                return (
                    <VStack
                        justifyContent={"flex-start"}
                        alignItems={"flex-start"}
                    >
                        <Text textAlign={"left"}>{time}</Text>
                        <NumberInput defaultValue={10}>
                            <NumberInputField />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                    </VStack>
                );
            })}
        </VStack>
    );
};

const TradingStatus = () => {
    const tradingStatus = [
        {
            label: "BTCUSDT",
            status: "OPEN",
        },
        { label: "GOLD", status: "OPEN" },
        { label: "NASDAQ", status: "OPEN" },
        { label: "WTI", status: "OPEN" },
    ];

    const options = ["OPEN", "CLOSED"];
    return (
        <VStack alignItems={"flex-start"} spacing={7}>
            <Text fontWeight={"bold"}>Trading Status</Text>
            {tradingStatus.map((status) => {
                return (
                    <VStack
                        justifyContent={"flex-start"}
                        alignItems={"flex-start"}
                    >
                        <Text>{status.label}</Text>
                        <Select size={"sm"} w={200}>
                            {options.map((option) => {
                                return <option value={option}>{option}</option>;
                            })}
                        </Select>
                    </VStack>
                );
            })}
        </VStack>
    );
};

const BalanceSetting = () => {
    return (
        <VStack
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={10}
        >
            <Text fontWeight={"bold"}>Minimum Amount</Text>
            <NumberInput defaultValue={5000}>
                <NumberInputField />
                <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                </NumberInputStepper>
            </NumberInput>
        </VStack>
    );
};
