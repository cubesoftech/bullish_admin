import { useAuthentication } from "@/utils/storage";
import {
  Button,
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Text,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  HStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useSWRConfig } from "swr";
import api from "@/utils/interfaceV2/api";
import { CreateDepositPayload } from "@/utils/interfaceV2/interfaces/payload";

function Withdraw({
  isOpen,
  onClose,
  limit,
}: {
  isOpen: boolean;
  onClose: () => void;
  limit: number;
}) {
  const [value, setValue] = useState(1);

  const { id, role } = useAuthentication();

  const toast = useToast();

  const { mutate } = useSWRConfig();

  const handleSubmit = async () => {
    const payload: CreateDepositPayload = {
      amount: value,
      membersID: id,
      memberRole: role,
    };
    try {
      await api.createDeposit({ ...payload })
      toast({
        title: "Withdrawal created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      mutate("getAgentWithdrawals");
      onClose();
    } catch (error) {
      toast({
        title: "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      mutate("getAgentWithdrawals");
      onClose();
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="top" size={"md"} onClose={onClose}>
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>출금</DrawerHeader>

        <DrawerBody mb={10}>
          <HStack spacing={2}>
            <Text>금액</Text>
            <NumberInput
              onChange={(e) => setValue(parseInt(e))}
              max={limit}
              min={1}
              step={1}
              defaultValue={1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            <Button onClick={handleSubmit} colorScheme="blue">
              Submit
            </Button>
          </HStack>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

export default Withdraw;
