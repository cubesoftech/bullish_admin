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
        alignItems={"center"}
        h={"10vh"}
        justifyContent={"space-between"}
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
        <VStack>
          <HStack justifyContent={"center"}>
            <Icon
              mr="4"
              fontSize="30"
              _groupHover={{
                color: "white",
              }}
              as={GiFamilyTree}
            />
            <Heading fontSize={['medium', 'large']} >정산</Heading>
            {showWithdraw && (
              <Button onClick={onOpen} colorScheme="red">
                출금
              </Button>
            )}
          </HStack>
        </VStack>

        <VStack justifyContent={"flex-end"} alignItems={"flex-end"}>
          <HStack m={5} alignItems={"center"}>
            <Text>month</Text>
            <Select
              size={['xs', 'md']}
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
      <VStack p={5}
        fontSize={['small', 'medium']}
        boxShadow={"lg"}
        w={"100%"}
        bgColor={"whiteAlpha.800"} h={"100vh"} flex={1} justifyContent={"flex-end"} alignItems={"flex-end"}>
        <HStack w={"100%"} m={1} alignItems={"center"}>
          <Text>총 수익 : {income.grossIncome.toLocaleString()} KRW</Text>
          <Text>총 순수익 : {income.netIncome.toLocaleString()} KRW</Text>
        </HStack>
      </VStack>
      <AuditTable income={data} />
    </VStack>
  );
}
