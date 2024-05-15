import {
  Button,
  Drawer,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Input,
  DrawerFooter,
  List,
  ListIcon,
  ListItem,
  VStack,
  Divider,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { MdCheckCircle } from "react-icons/md";
import { OrderHistoryColumnInterface } from "@/utils/interface";

function OrderHistoryDrawer({
  isOpen,
  onClose,
  OrderHistoryColumn,
}: {
  isOpen: boolean;
  onClose: () => void;
  OrderHistoryColumn: OrderHistoryColumnInterface;
}) {
  console.log(OrderHistoryColumn.tradePNL, "Here", isOpen);
  const {
    balance,
    email,
    id,
    membersId,
    name,
    nickname,
    result,
    timeExecuted,
    trade,
    tradeAmount,
    tradePNL,
    type,
  } = OrderHistoryColumn;

  const isWon = tradePNL > 0;

  const [additionalValue, setAdditionalValue] = React.useState<number>(0);

  const [newBalance, setNewBalance] = React.useState<number>(balance);

  const [newTradeAmount, setNewTradeAmount] =
    React.useState<number>(tradeAmount);

  const [newTradePNL, setNewTradePNL] = React.useState<number>(tradePNL);

  useEffect(() => {
    if (isWon) {
      setNewBalance(balance + additionalValue);
      setNewTradeAmount(tradeAmount + additionalValue);
      setNewTradePNL(tradePNL + additionalValue);
    } else {
      setNewBalance(balance - additionalValue);
      setNewTradeAmount(tradeAmount + additionalValue);
      setNewTradePNL(tradePNL - additionalValue);
    }
  }, [additionalValue]);

  const toast = useToast();

  const handleSave = async () => {
    if (additionalValue === 0) {
      toast({
        title: "Error",
        description: "Please input a value",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }
    const payload = {
      tradeId: id,
      membersId,
      balance: newBalance,
      tradeAmount: newTradeAmount,
      tradePNL: newTradePNL,
      type,
    };
    const url = "/api/orderhistorychanger";
    fetch(url, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          toast({
            title: "Success",
            description: "Successfully updated",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          onClose();
        } else {
          toast({
            title: "Error",
            description: "Failed to update",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        }
      })
      .catch((err) => {
        toast({
          title: "Error",
          description: "Failed to update",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      })
      .finally(() => {
        onClose();
        setAdditionalValue(0);
      });
  };
  return (
    <Drawer isOpen={isOpen} placement="right" size={"md"} onClose={onClose}>
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Order History Changer</DrawerHeader>

        <DrawerBody mb={10}>
          <List spacing={6}>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Name : {name}
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Nick Name: {nickname}
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Email: {email}
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Current Balance: {balance.toLocaleString()} KRW{" "}
              {additionalValue != 0 &&
                !isNaN(additionalValue) &&
                `----> ( ${newBalance.toLocaleString()} KRW )`}
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Time Executed: {timeExecuted}
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              User Trade: {trade}
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              PNL: {tradePNL.toLocaleString()} KRW
              {additionalValue !== 0 &&
                !isNaN(additionalValue) &&
                `----> ( ${newTradePNL.toLocaleString()} KRW )`}
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              Trade Amount: {tradeAmount.toLocaleString()} KRW
              {additionalValue !== 0 &&
                !isNaN(additionalValue) &&
                `----> ( ${newTradeAmount.toLocaleString()} KRW )`}
            </ListItem>
          </List>
          <VStack mt={5}>
            <Divider />
            <VStack
              w={"100%"}
              justifyContent={"flex-start"}
              alignItems={"flex-start"}
            >
              <Text fontWeight={"bold"}>
                Input amount to add in Trade Amount :
              </Text>
              <Input
                onChange={(e) => setAdditionalValue(parseInt(e.target.value))}
                type="number"
                placeholder="Trade Amount"
              />
            </VStack>
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} colorScheme="blue">
            Save
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default OrderHistoryDrawer;
