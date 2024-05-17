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
} from "@chakra-ui/react";
import { N1Min } from "@/utils/interface";
import { useSWRConfig } from "swr";
import { useState } from "react";

export default function HourTab({ trades }: { trades: N1Min[] }) {
  const toast = useToast();
  const { mutate } = useSWRConfig();
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
      await mutate("/api/trades");
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
    }
  };
  return (
    <VStack boxShadow={"lg"} bgColor={"whiteAlpha.800"} w={"100%"}>
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
              <Th>Trading Hour</Th>
              <Th>Result</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {trades?.map((trade, key) => {
              const time = new Date(trade.tradinghours);
              const convertedTime = `${time.toLocaleDateString()} ${time.toLocaleTimeString()}`;
              const result = trade.result ? "LONG" : "SHORT";
              const switcher = trade.result ? "SHORT" : "LONG";
              const [isLoading, setIsLoading] = useState(false);
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
                      isDisabled={key === 0}
                      margin={1}
                      size={"xs"}
                      colorScheme={trade.result ? "red" : "green"}
                    >
                      {key === 0
                        ? "This is Currently on trade"
                        : `Change to ${switcher}`}
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
