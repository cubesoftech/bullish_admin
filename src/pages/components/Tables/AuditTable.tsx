import {
  GetIncomeInterface,
  WithdrawalAgent,
  WithdrawalAgentArray,
} from "@/utils/interface_v2";
import { useAuthentication } from "@/utils/storage";
import {
  Button,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  useToast,
} from "@chakra-ui/react";
import useSWR, { useSWRConfig } from "swr";

function AuditTable({ income }: { income: GetIncomeInterface }) {
  const { role, id } = useAuthentication();

  const { mutate } = useSWRConfig();

  const { data, error } = useSWR<WithdrawalAgentArray>(
    "/api/getWithdrawals",
    async (url: any) => {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ membersId: id, role: role }),
      });
      const data = await response.json();
      return data;
    }
  );

  const toast = useToast();

  const handleClick = async (id: string) => {
    fetch("/api/approveWithdrawal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    })
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Withdrawal Approved",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        } else {
          toast({
            title: "Withdrawal Approval Failed",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
        mutate("/api/getWithdrawals");
      })
      .catch((error) => {
        toast({
          title: "Withdrawal Approval Failed",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        mutate("/api/getWithdrawals");
      });
  };

  return (
    <>
      <VStack bgColor={"whiteAlpha.800"} w={"100%"} boxShadow={"lg"} p={5}>
        <Table size={"sm"} variant={"striped"} colorScheme="cyan">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>Operator</Th>
              <Th>Master Agent</Th>
              <Th>Agent</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>Gross Income</Td>
              <Td>{income.totalOperatorGrossIncome.toLocaleString()} KRW</Td>
              <Td>{income.totalMasterAgentGrossIncome.toLocaleString()} KRW</Td>
              <Td>{income.totalAgentGrossIncome.toLocaleString()} KRW</Td>
            </Tr>
            <Tr>
              <Td>Net Income</Td>
              <Td>{income.totalOperatorNetIncome.toLocaleString()} KRW</Td>
              <Td>{income.totalMasterAgentNetIncome.toLocaleString()} KRW</Td>
              <Td>{income.totalAgentNetIncome.toLocaleString()} KRW</Td>
            </Tr>
          </Tbody>
        </Table>
      </VStack>
      <VStack bgColor={"whiteAlpha.800"} w={"100%"} boxShadow={"lg"} p={5}>
        <TableContainer overflowY={"scroll"} h={"40vh"}>
          <Table size={"sm"} variant={"striped"} colorScheme="cyan">
            <Thead>
              <Tr>
                <Th>#</Th>
                <Th>User Name</Th>
                <Th>Balance</Th>
                <Th>Total Withdraw</Th>
                <Th>Total Deposit</Th>
                <Th>Operator Gross Income</Th>
                <Th>Operator Net Income</Th>
                <Th>Master Agent Gross Income</Th>
                <Th>Master Agent Net Income</Th>
                <Th>Agent Gross Income</Th>
                <Th>Agent Net Income</Th>
              </Tr>
            </Thead>
            <Tbody>
              {income?.users.map((user, index) => {
                return (
                  <Tr key={index}>
                    <Td>{index + 1}</Td>
                    <Td>{user.name}</Td>
                    <Td>{user.balance.toLocaleString()} KRW</Td>
                    <Td>{user.withdrawals.toLocaleString()} KRW</Td>
                    <Td>{user.deposit.toLocaleString()} KRW</Td>
                    <Td>{user.operator_gross_income.toLocaleString()} KRW</Td>
                    <Td>{user.operator_net_income.toLocaleString()} KRW</Td>
                    <Td>
                      {user.master_agent_gross_income.toLocaleString()} KRW
                    </Td>
                    <Td>{user.master_agent_net_income.toLocaleString()} KRW</Td>
                    <Td>{user.agent_gross_income.toLocaleString()} KRW</Td>
                    <Td>{user.agent_net_income.toLocaleString()} KRW</Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </VStack>
      {role === "ADMIN" && data && (
        <VStack bgColor={"whiteAlpha.800"} w={"100%"} boxShadow={"lg"} p={5}>
          <TableContainer w={"100%"} overflowY={"scroll"} h={"40vh"}>
            <Table size={"sm"} variant={"striped"} colorScheme="cyan">
              <TableCaption placement="top">Withdrawals History</TableCaption>
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                  <Th>Date Submitted</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.withdrawal.map(
                  (withdrawal: WithdrawalAgent, index: number) => {
                    return (
                      <Tr key={index}>
                        <Td>{index + 1}</Td>
                        <Td>{withdrawal.amount.toLocaleString()} KRW</Td>
                        <Td>{withdrawal.status}</Td>
                        <Td>{new Date(withdrawal.createdAt).toDateString()}</Td>
                        <Td>
                          <Button
                            size={"sm"}
                            onClick={() => {
                              handleClick(withdrawal.id);
                            }}
                            colorScheme="blue"
                          >
                            Approve
                          </Button>
                        </Td>
                      </Tr>
                    );
                  }
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </VStack>
      )}
      {role !== "ADMIN" && data && (
        <VStack bgColor={"whiteAlpha.800"} w={"100%"} boxShadow={"lg"} p={5}>
          <TableContainer w={"100%"} overflowY={"scroll"} h={"40vh"}>
            <Table size={"sm"} variant={"striped"} colorScheme="cyan">
              <TableCaption placement="top">{`Total Withdrawal - ${
                income?.withdrawal?.toLocaleString() || 0
              } KRW`}</TableCaption>
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Amount</Th>
                  <Th>Status</Th>
                  <Th>Date Submitted</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.withdrawal.map(
                  (withdrawal: WithdrawalAgent, index: number) => {
                    return (
                      <Tr key={index}>
                        <Td>{index + 1}</Td>
                        <Td>{withdrawal.amount.toLocaleString()} KRW</Td>
                        <Td>{withdrawal.status}</Td>
                        <Td>{new Date(withdrawal.createdAt).toDateString()}</Td>
                      </Tr>
                    );
                  }
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </VStack>
      )}
    </>
  );
}

export default AuditTable;
