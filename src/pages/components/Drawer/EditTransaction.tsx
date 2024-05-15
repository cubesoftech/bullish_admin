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
import axios from "axios";
import { transaction_status } from "@prisma/client";

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
    useState<transaction_status>(status as transaction_status);
  const toast = useToast();

  const updateUser = async () => {
    const url = "/api/editTransaction";
    const payload: TransactionPayload = {
      status: transactionStatus,
      id: transaction.id as string,
      type: isWithdrawal ? "withdrawal" : "deposit",
    };
    try {
      await axios.post(url, payload);
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
  };
  return (
    <Drawer isOpen={isOpen} placement="right" size={"md"} onClose={onClose}>
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>
          Modify {isWithdrawal ? "Withdrawal" : "Deposit"}
        </DrawerHeader>

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
              <Text>Email</Text>
              <Input width={"100%"} readOnly defaultValue={email} />
            </VStack>
            <VStack
              w={"100%"}
              justifyContent={"flex-start"}
              alignItems={"flex-start"}
            >
              <Text>Amount (KRW) </Text>
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
              <Text>Select Transaction Status</Text>
              <Select
                w={"100%"}
                onChange={(e) =>
                  setTransactionStatus(e.target.value as transaction_status)
                }
                defaultValue={transactionStatus}
              >
                <option value={"pending"}>Pending</option>
                <option value={"completed"}>Completed</option>
                <option value={"failed"}>Failed</option>
              </Select>
            </VStack>
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={updateUser}>
            Update
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default EditTransaction;
