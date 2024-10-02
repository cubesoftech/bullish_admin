import {
  Button,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Text,
  Tr,
  VStack,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { N1Min } from "@/utils/interface";
import { useSWRConfig } from "swr";
import { use, useEffect, useState } from "react";

export default function HourTab({ trades }: { trades: N1Min[] }) {
  const toast = useToast();
  const { mutate } = useSWRConfig();

  return (
    <VStack boxShadow={"lg"} bgColor={useColorModeValue("whiteAlpha.800", "gray.700")} w={"100%"}>
      <TableContainer
        overflowY={"scroll"}
        h={"80vh"}
        borderColor={"black"}
        borderWidth={1}
        w={"100%"}
      >
        <Table size={"sm"} variant="striped" colorScheme="black">
          <TableCaption>Imperial to metric conversion factors</TableCaption>
          <Thead>
            <Tr>
              <Th>거래시간</Th>
              <Th>결과</Th>
              <Th>수정</Th>
            </Tr>
          </Thead>
          <Tbody>
            {trades?.map((trade, key) => {
              const time = new Date(trade.tradinghours);
              const convertedTime = `${time.toLocaleDateString()} ${time.toLocaleTimeString()}`;
              const result = trade.result ? "LONG" : "SHORT";
              const switcher = trade.result ? "SHORT" : "LONG";
              const [isLoading, setIsLoading] = useState(false);
              //get the time left before the trading hour ends
              const timeLeft = new Date(time).getTime() - Date.now();
              const isTenSecondsLeft = timeLeft < 5000;
              const [timeCounter, setTimeCounter] = useState(timeLeft / 1000);

              const handleClick = async (id: string, result: boolean) => {
                const url = "/api/changetraderesult";
                const data = { result, id };
                try {
                  await fetch(url, {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
                  toast({
                    title: "Trade result changed.",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                  });
                } catch (error) {
                  toast({
                    title: "An error occurred.",
                    description: "Unable to change the trade result.",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                  });
                } finally {
                  await mutate("/api/trades");
                }
              };

              useEffect(() => {
                const interval = setInterval(() => {
                  setTimeCounter((prev) => prev - 1);
                }, 1000);
                return () => clearInterval(interval);
              }, [timeLeft]);
              return (
                <Tr key={trade.id}>
                  <Td>{convertedTime}</Td>
                  <Td>
                    <Text
                      color={trade.result ? "green" : "red"}
                      fontWeight={"bold"}
                    >
                      {result}
                    </Text>
                  </Td>
                  <Th>
                    <Button
                      isLoading={isLoading}
                      loadingText="Changing..."
                      onClick={async () => {
                        setIsLoading(true);
                        await handleClick(trade.id, !trade.result);
                        setIsLoading(false);
                      }}
                      isDisabled={key === 0 && isTenSecondsLeft}
                      margin={1}
                      size={"xs"}
                      colorScheme={trade.result ? "red" : "green"}
                    >
                      {
                        `다음으로 변경 ${switcher === "LONG" ? "LONG" : "SHORT"
                        }`
                      }

                    </Button>
                  </Th>
                </Tr>
              );
            })}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>To convert</Th>
              <Th>into</Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </VStack>
  );
}
