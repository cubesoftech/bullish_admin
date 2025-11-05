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
import React, { useEffect, useState } from "react";
import { MdCheckCircle } from "react-icons/md";
import { OrderHistoryColumnInterface } from "@/utils/interface";
import axios from "axios";
import api from "@/utils/interfaceV2/api";



function OrderHistoryDrawer({
  isOpen,
  onClose,
  OrderHistoryColumn,
  refetch,
}: {
  isOpen: boolean;
  onClose: () => void;
  OrderHistoryColumn: OrderHistoryColumnInterface;
  refetch: () => void;
}) {
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

  const [newTrade, setNewTrade] = useState<number>(tradeAmount);

  const toast = useToast();

  const handleSave = async () => {
    try {
      const payload = {
        tradeID: id,
        membersId,
        newAmount: newTrade
      }

      const { message } = await api.updateMemberTrade({ ...payload })
      toast({
        title: "Success",
        description: message,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (e: any) {
      toast({
        title: "Error",
        description: e as string,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } finally {
      onClose();
      refetch();
    }
  };
  return (
    <Drawer isOpen={isOpen} placement="right" size={"md"} onClose={onClose}>
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>배팅기록조작</DrawerHeader>

        <DrawerBody mb={10}>
          <List spacing={6}>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              이름 : {name}
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              닉네임: {nickname}
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              아이디: {email}
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              보유잔액: {balance.toLocaleString()} KRW
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              주문 시간: {timeExecuted}
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              거래: {trade}
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              수익결과: {tradePNL.toLocaleString()} KRW
            </ListItem>
            <ListItem>
              <ListIcon as={MdCheckCircle} color="green.500" />
              거래금액: {tradeAmount.toLocaleString()} KRW
            </ListItem>
          </List>
          <VStack mt={5}>
            <Divider />
            <VStack
              w={"100%"}
              justifyContent={"flex-start"}
              alignItems={"flex-start"}
            >
              <Text fontWeight={"bold"}>수정할 거래금액을 입력해주세요 :</Text>
              <Input
                onChange={(e) => setNewTrade(Number(e.target.value))}
                type="number"
                placeholder="거래금액"
              />
            </VStack>
          </VStack>
        </DrawerBody>

        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            취소
          </Button>
          <Button onClick={handleSave} colorScheme="blue">
            저장
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default OrderHistoryDrawer;
