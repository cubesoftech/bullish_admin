import {
  Button,
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  VStack,
  Text,
  Input,
  useToast,
  Select,
} from "@chakra-ui/react";
import { TransactionColumn, TransactionPayload } from "@/utils/interface";
import { useState } from "react";
import api from "@/utils/interfaceV2/api";
import { TransactionStatus } from "@/utils/interfaceV2/interfaces";

function EditTransaction({
  isOpen,
  onClose,
  transaction,
  refetch,
  isWithdrawal,
}: {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionColumn;
  refetch: () => void;
  isWithdrawal: boolean;
}) {
  const { accountHolder, accountNumber, status, amount, email, id } =
    transaction;

  const [transactionState, setTransactionState] =
    useState<TransactionColumn>(transaction);

  const [transactionStatus, setTransactionStatus] =
    useState<TransactionStatus>(status as TransactionStatus);
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const updateUser = async () => {
    setIsLoading(true);
    const payload: TransactionPayload = {
      status: transactionStatus,
      id: transaction.id as string,
      type: isWithdrawal ? "withdrawal" : "deposit",
    };
    try {
      await api.updateTransaction({
        transactionId: payload.id,
        newStatus: payload.status as TransactionStatus,
        type: payload.type
      })
      toast({
        title: "User Updated",
        description: "User has been updated",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "An error has occured",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setIsLoading(false);
  };
  return (
    <Drawer isOpen={isOpen} placement="right" size={"md"} onClose={onClose}>
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>{isWithdrawal ? "출금요청" : "입금요청"}</DrawerHeader>

        <DrawerBody mb={10}>
          <VStack
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            spacing={1}
          >
            <VStack
              w={"100%"}
              justifyContent={"flex-start"}
              alignItems={"flex-start"}
            >
              <Text>아이디</Text>
              <Input width={"100%"} readOnly defaultValue={email} />
            </VStack>
            <VStack
              w={"100%"}
              justifyContent={"flex-start"}
              alignItems={"flex-start"}
            >
              <Text>금액 (KRW) </Text>
              <Input
                width={"100%"}
                readOnly
                defaultValue={amount.toLocaleString()}
              />
            </VStack>
            <VStack
              w={"100%"}
              justifyContent={"flex-start"}
              alignItems={"flex-start"}
            >
              <Text>요청상태</Text>
              <Select
                w={"100%"}
                onChange={(e) =>
                  setTransactionStatus(e.target.value as TransactionStatus)
                }
                defaultValue={transactionStatus}
              >
                <option value={"pending"}>대기</option>
                <option value={"completed"}>완료</option>
                <option value={"failed"}>취소</option>
              </Select>
            </VStack>
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            취소
          </Button>
          <Button colorScheme="blue" isLoading={isLoading} onClick={updateUser}>
            업데이트
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default EditTransaction;
