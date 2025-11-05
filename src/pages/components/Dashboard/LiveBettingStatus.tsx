import { GetIncomeInterface } from "@/utils/interface_v2";
import {
  VStack,
  Heading,
  Icon,
  HStack,
  Text,
  Select,
  Button,
  useDisclosure,
  Box,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GiFamilyTree } from "react-icons/gi";
import axios from "axios";
import { OngoingTradeResult } from "@/utils/interface";
import { Chart } from 'react-google-charts'
import { title } from "process";
import api from "@/utils/interfaceV2/api";

export default function LiveBettingStatus() {

  const [result, setResult] = useState<OngoingTradeResult>({});

  const fetchOngoingTradeResult = async () => {
    try {
      const { data } = await api.getOngoingTrades()
      setResult(data);
    } catch (error) {
      console.log("Error fetching ongoing trade result:", error);
    }
  }

  useEffect(() => {
    fetchOngoingTradeResult();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOngoingTradeResult();
    }, 1000); // Check every second

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
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
        bgColor={useColorModeValue("whiteAlpha.800", "gray.700")}
      >

        <HStack justifyContent={"center"}>
          <Icon
            mr="4"
            fontSize="30"
            _groupHover={{
              color: "white",
            }}
            as={GiFamilyTree}
          />
          <Heading fontSize={['medium', 'large']}>Live Betting Status</Heading>
        </HStack>

      </HStack>
      <VStack w={'100%'} h={'100vh'} flex={1} justifyContent={"flex-end"} alignItems={"flex-end"}>
        <HStack w={'100%'} m={1} alignItems={"center"}>
          {/* create a circle chart  */}
          <CircleChart data={result} />

        </HStack>
      </VStack>
    </VStack >
  );
}


const CircleChart = ({ data }: { data: OngoingTradeResult }) => {
  //check if data is empty
  if (Object.keys(data).length === 0) {
    return <Text>No Trading Data</Text>
  }
  return (
    <SimpleGrid w={'100%'} columns={[1, 3]} spacing={1}>
      {
        Object.keys(data).map((key, index) => {
          return <DisplayTradeStatus key={index} data={data} index={index} keys={key} />
        })
      }
    </SimpleGrid>
  );
}

function DisplayTradeStatus({ data, index, keys }: { data: OngoingTradeResult, index: number, keys: string }) {
  const { totalAmountLong, totalAmountShort, totalLong, totalShort, result } = data[keys];
  const datas = [
    ['Task', 'Total'],
    ['Long', totalAmountLong],
    ['Short', totalAmountShort],
  ];
  const companyProfit = !result ? totalAmountLong - totalAmountShort : totalAmountShort - totalAmountLong;
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    try {
      await api.updateTradeResult({
        tradeId: data[keys].tradeID,
        result: !result
      })
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }
  return (
    <VStack alignItems={'center'} justifyContent={'center'} key={index} m={1}>
      <Chart
        options={{
          is3D: true,
          title: keys,
          backgroundColor: 'transparent',
          colors: ['green', 'red'],
          chartArea: { width: '100%', height: '100%' },
        }}
        chartType="PieChart"
        data={datas} />
      <Text w={'100%'} fontWeight={'bold'} textAlign={'left'}>{keys}</Text>
      <SimpleGrid fontWeight={'bold'} fontSize={'x-small'} w={'100%'} columns={2} spacing={1}>
        <Text>Total Long: {totalLong}</Text>
        <Text>Total Short: {totalShort}</Text>

      </SimpleGrid>
      <SimpleGrid fontWeight={'bold'} fontSize={'x-small'} w={'100%'} columns={2} spacing={1}>
        <Text>Total Long Amount: {totalAmountLong.toLocaleString()}</Text>
        <Text>Total Short Amount: {totalAmountShort.toLocaleString()}</Text>
      </SimpleGrid>
      <Box fontSize={'sm'} textAlign={'center'} width={'100%'} justifyContent={'center'} bgColor={'gray.300'} alignItems={'center'} w={'100%'} color={result ? "green" : "red"}>
        {result ? <Text>Incoming Result: LONG</Text> : <Text>Incoming Result: SHORT</Text>}
        <Text color={'black'}>Company Profit: {companyProfit.toLocaleString()}</Text>
      </Box>
      <Button
        onClick={() => {
          handleClick();
        }}
        isLoading={loading}
        w={'100%'}
        colorScheme={'blue'}
        size={'sm'}
      >
        Change Result
      </Button>
    </VStack>
  );
}
