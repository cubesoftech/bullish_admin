import {
  GetIncomeInterface,
  WithdrawalAgent,
  WithdrawalAgentArray,
} from "@/utils/interface_v2";
import { useAuthentication } from "@/utils/storage";
import {
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import useSWR, { useSWRConfig } from "swr";
import WithdrawalAdmin from "./AuditTables/WithdrawalAdmin";
import WithdrawalNonAdmin from "./AuditTables/WithdrawalNonAdmin";
import api from "@/utils/interfaceV2/api";
import { MemberRoles } from "@/utils/interfaceV2/interfaces";
import { GetAgentWithdrawalsResponse } from "@/utils/interfaceV2/interfaces/responses";

function AuditTable({ income }: { income: GetIncomeInterface }) {
  const { role, id } = useAuthentication();

  const { mutate } = useSWRConfig();

  const { data, error } = useSWR<GetAgentWithdrawalsResponse>(
    "getAgentWithdrawals",
    () => api.getAgentWithdrawals({
      membersId: id,
      role: role as MemberRoles,
    })
  );

  const toast = useToast();

  const handleClick = async (id: string) => {
    try {
      await api.updateWithdrawalStatus({
        id: id,
        status: "completed"
      })
      toast({
        title: "Withdrawal Approved",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      mutate("getAgentWithdrawals");
    } catch (error) {
      toast({
        title: "Withdrawal Approval Failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      mutate("getAgentWithdrawals");
    }
  };

  return (
    <>
      <VStack bgColor={useColorModeValue("whiteAlpha.800", "gray.700")} w={"100%"} boxShadow={"lg"} p={5}>
        <TableContainer w={"100%"} overflowY={"scroll"}>
          <Table size={"sm"} variant={"striped"} colorScheme="cyan">
            <Thead>
              <Tr>
                <Th>#</Th>
                {role === "ADMIN" && <Th>본사</Th>}
                {(role === "ADMIN" || role === "MASTER_AGENT") && <Th>총판</Th>}
                <Th>에이전트</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>매출</Td>
                {role === "ADMIN" && (
                  <Td>{income.totalOperatorGrossIncome.toLocaleString()} KRW</Td>
                )}
                {(role === "ADMIN" || role === "MASTER_AGENT") && (
                  <Td>
                    {income.totalMasterAgentGrossIncome.toLocaleString()} KRW
                  </Td>
                )}

                <Td>{income.totalAgentGrossIncome.toLocaleString()} KRW</Td>
              </Tr>
              <Tr>
                <Td>수익</Td>
                {role === "ADMIN" && (
                  <Td>{income.totalOperatorNetIncome.toLocaleString()} KRW</Td>
                )}
                {(role === "ADMIN" || role === "MASTER_AGENT") && (
                  <Td>{income.totalMasterAgentNetIncome.toLocaleString()} KRW</Td>
                )}
                <Td>{income.totalAgentNetIncome.toLocaleString()} KRW</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>

      </VStack>
      <WithdrawalNonAdmin data={income} />
      {role === "ADMIN" && data && (
        <WithdrawalAdmin data={data} handleClick={handleClick} />
      )}
      {role !== "ADMIN" && data && (
        <VStack bgColor={"whiteAlpha.800"} w={"100%"} boxShadow={"lg"} p={5}>
          <TableContainer w={"100%"} overflowY={"scroll"} h={"40vh"}>
            <Table size={"sm"} variant={"striped"} colorScheme="cyan">
              <TableCaption placement="top">{`누적 출금액 - ${income?.withdrawal?.toLocaleString() || 0
                } KRW`}</TableCaption>
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>금액</Th>
                  <Th>상태</Th>
                  <Th>신청일</Th>
                </Tr>
              </Thead>
              <Tbody>
                {data.data.map(
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
function newFunction(role: string, income: GetIncomeInterface) {
  return (
    <VStack bgColor={useColorModeValue("whiteAlpha.800", "gray.700")} w={"100%"} boxShadow={"lg"} p={5}>
      <TableContainer w={"100%"} overflowY={"scroll"} h={"40vh"}>
        <Table size={"sm"} variant={"striped"} colorScheme="cyan">
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>사용자명</Th>
              <Th>잔액</Th>
              <Th>총 출금액</Th>
              <Th>총 입금액</Th>
              {role === "ADMIN" && <Th>본사매출</Th>}
              {role === "ADMIN" && <Th>본사수익</Th>}

              {(role === "ADMIN" || role === "MASTER_AGENT") && (
                <Th>총판매출</Th>
              )}
              {(role === "ADMIN" || role === "MASTER_AGENT") && (
                <Th>총판수익</Th>
              )}
              <Th>에이전트매출</Th>
              <Th>에이전트수익</Th>
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
                  {role === "ADMIN" && (
                    <Td>{user.operator_gross_income.toLocaleString()} KRW</Td>
                  )}
                  {role === "ADMIN" && (
                    <Td>{user.operator_net_income.toLocaleString()} KRW</Td>
                  )}
                  {(role === "ADMIN" || role === "MASTER_AGENT") && (
                    <Td>
                      {user.master_agent_gross_income.toLocaleString()} KRW
                    </Td>
                  )}
                  {(role === "ADMIN" || role === "MASTER_AGENT") && (
                    <Td>{user.master_agent_net_income.toLocaleString()} KRW</Td>
                  )}

                  <Td>{user.agent_gross_income.toLocaleString()} KRW</Td>
                  <Td>{user.agent_net_income.toLocaleString()} KRW</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
}
