import React, { HTMLProps, useState, useEffect, useMemo } from "react";
import { VStack, Heading, Icon, HStack, useToast, Text, useDisclosure, useColorModeValue, Switch, Button, Select, Stack } from "@chakra-ui/react";
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverFooter, PopoverArrow, PopoverCloseButton, PopoverAnchor, } from '@chakra-ui/react'
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { ArrayUser, UserColumn, UserTrades, TradesType } from "@/utils/interface";
import axios from "axios";
import { FiStar } from "react-icons/fi";
import UserTable from "../Tables/UserTable";
import { useAuthentication } from "@/utils/storage";
import { useRouter } from "next/router";
import User from "./User";
import { socket } from "@/utils/socket";
import api from "@/utils/interfaceV2/api";

const SwitchButton = ({ id, isChecked, setRefetch }: { id: string, isChecked: boolean, setRefetch: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [checked, setChecked] = React.useState(isChecked);

  const handleChange = async () => {
    setChecked(!checked);
    try {
      await api.forceLogoutUser({
        userId: id,
        forceLogout: !checked
      })
      setChecked(!checked);
      setRefetch(true);
    } catch (error) {
      console.log("Error updating switch:", error);
      setChecked(checked);
    }
  }
  return (
    <Switch
      isChecked={checked}
      onChange={handleChange}
      size="lg"
      ml={2}
    />
  );
}

const ReverseBetSwitch = ({ id, isChecked, setRefetch }: { id: string, isChecked: boolean, setRefetch: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [checked, setChecked] = useState<boolean>(isChecked);

  const toast = useToast()

  const handleChange = async () => {
    setChecked(!checked);

    try {
      await api.updateUserSwitchBet({
        userId: id,
        status: !checked
      })
      setChecked(!checked);
      setRefetch(true);
    } catch (error) {
      console.log("Error updating switch bet:", error);
    }
  }

  return (
    <Switch
      isChecked={checked}
      onChange={handleChange}
      size="lg"
      ml={2}
    />
  )
}

const ChangeTrade = ({ id, setRefetch }: { id: string, setRefetch: React.Dispatch<React.SetStateAction<boolean>> }) => {

  const toast = useToast()

  const [userTrades, setUserTrades] = useState<UserTrades>()
  const changeTrades = useDisclosure()

  const Trades = [
    { label: "NASDAQ", value: userTrades?.nasdaq },
    { label: "GOLD", value: userTrades?.gold },
    { label: "EURUSD", value: userTrades?.eurusd },
    { label: "PLTR", value: userTrades?.pltr },
    { label: "TSLA", value: userTrades?.tsla },
    { label: "NVDA", value: userTrades?.nvda },
  ]

  const Options: { label: string, value: TradesType }[] = [
    { label: "NASDAQ", value: "nasdaq" },
    { label: "GOLD", value: "gold" },
    { label: "EURUSD", value: "eurusd" },
    { label: "PLTR", value: "pltr" },
    { label: "TSLA", value: "tsla" },
    { label: "NVDA", value: "nvda" },
  ]

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.getUserTrades({ userId: id })
        setUserTrades(data)
      } catch (e) {
        console.log("Error: ", e)
      }
    }
    fetch()
  }, [id, changeTrades.isOpen])

  const handleUpdateUserTrades = async () => {
    if (!userTrades) return;
    try {

      await api.updateUserTrades({
        userId: id,
        nasdaq: userTrades.nasdaq,
        gold: userTrades.gold,
        eurusd: userTrades.eurusd,
        pltr: userTrades.pltr,
        tsla: userTrades.tsla,
        nvda: userTrades.nvda,
      })

      toast({
        title: "성공",
        description: "거래가 변경되었습니다.",
        status: "success"
      })
      socket.emit("change_site_settings")
      setRefetch(true)
    } catch (e) {
      console.error("Error: ", e)
    }
  }

  return (
    <Popover placement="bottom">
      <PopoverTrigger>
        <Button
          onClick={changeTrades.onToggle}
          colorScheme="green"
          size={"sm"}
          variant={"solid"}
          mr={1}
        >
          Change Trades
        </Button>
      </PopoverTrigger>
      <PopoverContent border={"1px solid"} borderColor={"gray.200"} borderRadius={"lg"} overflow={"hidden"} shadow={"2xl"} >
        <PopoverArrow />
        <PopoverBody p={3}>
          <Stack w={"100%"} h={"full"} gap={4}>
            {
              Trades.map((trade, index) => {
                return (
                  <Stack w={"100%"} gap={2} key={index}>
                    <Text fontSize={"medium"} fontWeight={500}>{trade.label}</Text>
                    <Select value={trade.value} onChange={(e) => {
                      const trades = { ...userTrades };
                      const tradeKey = Object.keys(userTrades || [])[index] as keyof UserTrades;
                      if (tradeKey) {
                        trades[tradeKey] = e.target.value as TradesType;
                        setUserTrades(trades as UserTrades)
                      }
                    }} >
                      {
                        Options.map((option, idx) => {
                          return (
                            <option value={option.value} key={idx}>{option.label}</option>
                          );
                        })
                      }
                    </Select>
                  </Stack>
                );
              })
            }
            <Stack w={"100%"} direction={"row"} justifyContent={"flex-end"} alignItems={"center"}>
              <Button colorScheme="green" onClick={handleUpdateUserTrades}>Save</Button>
            </Stack>
          </Stack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}

const MaxBetSwitch = ({ id, isChecked, setRefetch }: { id: string, isChecked: boolean, setRefetch: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [checked, setChecked] = useState<boolean>(isChecked);

  const toast = useToast()

  const handleChange = async () => {
    try {
      await api.updateUserMaxbet({
        userId: id,
        value: !checked
      })
      setChecked(!checked)
      setRefetch(true)
    } catch (e) {
      toast({
        title: "Error",
        description: "Error updating max bet",
        status: "error"
      })
    }
  }

  return (
    <Switch
      isChecked={checked}
      onChange={handleChange}
      size="lg"
      ml={2}
    />
  );
}

export default function UserManagement() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { role, id } = useAuthentication();
  const [selectedUser, setSelectedUser] = React.useState({
    tester: true,
    realUsers: true,
    lastOnline: false,
  });

  const [rowSelection, setRowSelection] = React.useState({});

  let columns = useMemo<ColumnDef<UserColumn>[]>(
    () => [
      {
        accessorKey: "name",
        cell: (info) => info.getValue(),
        header: "이름",
        footer: "Name",
      },
      {
        accessorKey: "email",
        accessorFn: (row) => row.email,
        id: "email",
        header: "아이디",
        cell: (info) => {
          const { isOpen, onClose, onOpen } = useDisclosure();
          return (
            <HStack>
              <User id={info.getValue() as any} onClose={onClose} isOpen={isOpen} />
              <Text as={'u'} variant={'link'} cursor={'grab'} onClick={() => {
                onOpen();
              }}
              >{info.getValue() as any as string}</Text>
            </HStack>
          )
        },
        footer: "Email",
      },
      {
        accessorKey: "bank",
        header: "은행",
        cell: (info) => info.getValue(),
        footer: "Bank",
      },
      {
        accessorKey: "accountnumber",
        accessorFn: (row) => row.accountnumber,
        header: "계좌 번호",
        cell: (info) => info.getValue(),
        footer: "Account Number",
      },
      {
        accessorKey: "accountholder",
        header: "계좌 주",
        cell: (info) => info.getValue(),
        footer: "Account Holder",
      },
      {
        accessorKey: "balance",
        cell: (info) => info.getValue(),
        header: "잔액",
        footer: "Balance",
      },
      {
        accessorKey: "lastOnline",
        header: "최근접속순",
        cell: (info: any) => info.getValue()?.toLocaleString(),
      },
      {
        accessorKey: "createdAt",
        header: "가입일순",
        cell: (info: any) => info.getValue()?.toLocaleString(),
      },
      {
        accessorKey: "force",
        header: "강제 로그아웃",
        cell: (info) => <SwitchButton isChecked={info.getValue() as boolean} id={info.row.original.id} setRefetch={setRefetch} />,
      },
      {
        accessorKey: "switchBet",
        header: "역방향 베팅",
        cell: (info) => <ReverseBetSwitch isChecked={info.getValue() as boolean} id={info.row.original.id} setRefetch={setRefetch} />,
      },
      {
        accessorKey: "maxBet",
        header: "Max",
        cell: (info) => <MaxBetSwitch isChecked={info.getValue() as boolean} id={info.row.original.id} setRefetch={setRefetch} />,
      },
      {
        accessorKey: "changeTrades",
        header: "거래 수정",
        cell: (info) => <ChangeTrade id={info.row.original.id} setRefetch={setRefetch} />
      }
    ],
    []
  );

  if (role === "ADMIN") {
    columns.unshift({
      id: "select",
      header: ({ table }) => (
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
        />
      ),
      cell: ({ row }) => (
        <div className="px-1">
          <IndeterminateCheckbox
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        </div>
      ),
    });
    columns.push({
      accessorKey: "masteragentID",
      header: "총판",
      cell: (info) => info.getValue(),
      footer: "총판",
    });
    columns.push({
      accessorKey: "agentID",
      header: "에이전트",
      cell: (info) => info.getValue(),
      footer: "에이전트",
    });
  }

  if (role === "MASTER_AGENT") {
    columns.push({
      accessorKey: "agentID",
      header: "Agent",
      cell: (info) => info.getValue(),
      footer: "Agent",
    });
  }

  const [data, setData] = React.useState<UserColumn[]>([]);

  const [refetch, setRefetch] = React.useState(true);

  const requestAllUsers = async () => {
    setData([]);
    let hasMoreData = true;
    let page = 1;
    while (hasMoreData) {
      const { hasMore, users } = await api.getUser({
        page,
        id,
        role
      })
      //clean first the new data by removign the duplicates from the data
      //check if the id is already in the data
      users.map((user) => {
        const {
          id,
          name,
          email,
          bank,
          accountnumber,
          accountholder,
          balance,
          password,
          nickname,
          createdAt,
          lastOnline,
          switchBet
        } = user;
        if (!selectedUser.tester) {
          if (email.includes("test")) {
            return;
          }
        }
        if (selectedUser.lastOnline) {
          // if the last online is already 5 seconds ago then skip
          const lastOnline = new Date(user.lastOnline);
          const now = new Date();
          const diff = now.getTime() - lastOnline.getTime();
          if (diff > 5000) {
            return;
          }
        }
        if (!selectedUser.realUsers) {
          if (!email.includes("test")) {
            return;
          }
        }
        setData((data) => [
          ...data,
          {
            accountholder,
            accountnumber,
            balance,
            bank,
            email,
            id,
            name,
            nickname,
            password,
            agentID: user.agentID,
            agents: user.agents,
            masteragentID: user.masteragentID,
            status: user.status,
            lastOnline: new Date(user.lastOnline),
            createdAt: new Date(user.createdAt),
            force: user.force,
            switchBet: user.switchBet,
            changeTrades: user.changeTrades,
            maxBet: user.maxBet,
            phonenumber: user.phonenumber
          },
        ]);
      });
      hasMoreData = hasMore;
      page++;
    }
  };

  const toast = useToast();

  useEffect(() => {
    if (refetch) {
      try {
        requestAllUsers();
        setRefetch(false);
      } catch (error) {
        toast({
          title: "An error occurred.",
          description: "Unable to fetch the data.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  }, [refetch, selectedUser.realUsers, selectedUser.tester]);

  return (
    <VStack spacing={5}>
      <HStack
        alignItems={"flex-end"}
        h={"10vh"}
        justifyContent={"flex-start"}
        w={"100%"}
        p={5}
        boxShadow={"lg"}
        bgColor={useColorModeValue("whiteAlpha.800", "gray.700")}
      >
        <HStack justifyContent={"center"}>
          <Icon
            mr="4"
            fontSize="30"
            _groupHover={{
              color: "white",
            }}
            as={FiStar}
          />
          <Heading>사용자 관리</Heading>
        </HStack>
      </HStack>
      <UserTable
        pagination={pagination}
        setPagination={setPagination}
        columns={columns}
        data={data}
        setRefetch={setRefetch}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
      />
    </VStack>
  );
}

function IndeterminateCheckbox({
  indeterminate,
  className = "",
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={ref}
      className={className + " cursor-pointer"}
      {...rest}
    />
  );
}
