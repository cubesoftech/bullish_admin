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
  SimpleGrid,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GiFamilyTree } from "react-icons/gi";
import axios from "axios";
import { OngoingTradeResult } from "@/utils/interface";
import { Chart } from 'react-google-charts'

export default function LiveBettingStatus() {

  const [result, setResult] = useState<OngoingTradeResult>({});

  const fetchOngoingTradeResult = async () => {
    axios.get<OngoingTradeResult>("/api/getAllOngoingTrade").then((res) => {
      setResult(res.data);
    })
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
        bgColor={"whiteAlpha.800"}
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
          <Heading>Live Betting Status</Heading>
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
    <SimpleGrid w={'100%'} columns={[1, 2]} spacing={1}>
      {
        Object.keys(data).map((key, index) => {
          const { totalAmountLong, totalAmountShort, totalLong, totalShort } = data[key];
          const datas = [
            ['Task', 'Total'],
            ['Long', totalAmountLong],
            ['Short', totalAmountShort],
          ];
          return (
            <VStack alignItems={'center'} key={index} m={1}>
              <Chart
                options={{
                  is3D: true,
                  height: 400,
                  width: 400,
                  title: key,
                  backgroundColor: 'transparent',
                }}

                chartType="PieChart"
                data={datas}
              />
            </VStack>
          );
        })
      }
    </SimpleGrid>
  );
}