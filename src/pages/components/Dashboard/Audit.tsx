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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { GiFamilyTree } from "react-icons/gi";
import axios from "axios";
import AuditTable from "../Tables/AuditTable";
import { useAuthentication } from "@/utils/storage";
import Withdraw from "../Drawer/Withdraw";

export default function AUDIT() {
  const { role, id } = useAuthentication();
  const [income, setIncome] = useState({ grossIncome: 0, netIncome: 0 });
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );
  const [showWithdraw, setShowWithdraw] = useState<boolean>(false);
  const [data, setData] = useState<GetIncomeInterface>({
    totalAgentGrossIncome: 0,
    totalAgentNetIncome: 0,
    totalMasterAgentGrossIncome: 0,
    totalMasterAgentNetIncome: 0,
    totalOperatorGrossIncome: 0,
    totalOperatorNetIncome: 0,
    withdrawal: 0,
    users: [],
  });
  useEffect(() => {
    console.log(role);
    if (role === "MASTER_AGENT") {
      setShowWithdraw(true);
      setIncome({
        grossIncome: data.totalMasterAgentGrossIncome,
        netIncome: data.totalMasterAgentNetIncome,
      });
    }
    if (role === "AGENT") {
      setShowWithdraw(true);
      setIncome({
        grossIncome: data.totalAgentGrossIncome,
        netIncome: data.totalAgentNetIncome,
      });
    }
    if (role === "ADMIN") {
      setShowWithdraw(false);
      setIncome({
        grossIncome: data.totalOperatorGrossIncome,
        netIncome: data.totalOperatorNetIncome,
      });
    }
  }, [role, id, data]);

  useEffect(() => {
    if (selectedMonth) {
      axios
        .get(`/api/getIncome?month=${selectedMonth}&role=${role}&id=${id}`)
        .then((res) => {
          setData(res.data);
        });
    }
  }, [selectedMonth, role, id]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();
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
        <Withdraw
          limit={income.grossIncome}
          isOpen={isOpen}
          onClose={onClose}
        />
        <HStack justifyContent={"center"}>
          <Icon
            mr="4"
            fontSize="30"
            _groupHover={{
              color: "white",
            }}
            as={GiFamilyTree}
          />
          <Heading>AUDIT</Heading>
          <HStack m={5}>
            <Text>Gross Income :</Text>
            <Text>{income.grossIncome.toLocaleString()} KRW</Text>
          </HStack>
          <HStack m={5} alignItems={"flex-end"}>
            <Text>Net Income :</Text>
            <Text>{income.netIncome.toLocaleString()} KRW</Text>
          </HStack>

          {showWithdraw && (
            <Button onClick={onOpen} colorScheme="red">
              Withdraw
            </Button>
          )}
        </HStack>
        <VStack flex={1} justifyContent={"flex-end"} alignItems={"flex-end"}>
          <HStack m={5} alignItems={"center"}>
            <Text>Month</Text>
            <Select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(Number(e.target.value));
              }}
            >
              {months.map((month, index) => (
                <option key={index} value={index + 1}>
                  {month}
                </option>
              ))}
            </Select>
          </HStack>
        </VStack>
      </HStack>
      <AuditTable income={data} />
    </VStack>
  );
}
