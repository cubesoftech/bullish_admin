import { DepositInterface } from "@/pages/api/createDeposit";
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
    const payload: DepositInterface = {
      amount: value,
      membersId: id,
      role: role,
    };
    const url = "/api/createDeposit";
    try {
      await axios.post(url, payload);
      toast({
        title: "Withdrawal created successfully",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      mutate("/api/getWithdrawals");
      onClose();
    } catch (error) {
      toast({
        title: "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      mutate("/api/getWithdrawals");
      onClose();
    }
  };

  return (
    <Drawer isOpen={isOpen} placement="top" size={"md"} onClose={onClose}>
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Withdraw</DrawerHeader>

        <DrawerBody mb={10}>
          <HStack spacing={2}>
            <Text>Amount</Text>
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
