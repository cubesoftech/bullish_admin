import React, { HTMLProps, useEffect, useMemo } from "react";
import { VStack, Heading, Icon, HStack, useToast, Text, useDisclosure, useColorModeValue } from "@chakra-ui/react";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { ArrayUser, UserColumn } from "@/utils/interface";
import axios from "axios";
import { FiStar } from "react-icons/fi";
import UserTable from "../Tables/UserTable";
import { useAuthentication } from "@/utils/storage";
import { useRouter } from "next/router";
import User from "./User";

export default function UserManagement() {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const router = useRouter();

  const { role, id } = useAuthentication();
  const [selectedUser, setSelectedUser] = React.useState({
    tester: true,
    realUsers: true,
    lastOnline: false,
  });

  const [rowSelection, setRowSelection] = React.useState({});

  let columns = useMemo<ColumnDef<UserColumn>[]>(
    () => [
      // {
      //   id: "select",
      //   header: ({ table }) => (
      //     <IndeterminateCheckbox
      //       {...{
      //         checked: table.getIsAllRowsSelected(),
      //         indeterminate: table.getIsSomeRowsSelected(),
      //         onChange: table.getToggleAllRowsSelectedHandler(),
      //       }}
      //     />
      //   ),
      //   cell: ({ row }) => (
      //     <div className="px-1">
      //       <IndeterminateCheckbox
      //         {...{
      //           checked: row.getIsSelected(),
      //           disabled: !row.getCanSelect(),
      //           indeterminate: row.getIsSomeSelected(),
      //           onChange: row.getToggleSelectedHandler(),
      //         }}
      //       />
      //     </div>
      //   ),
      // },
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
      // {
      //   accessorKey: "nickname",
      //   header: "닉네임",
      //   cell: (info) => info.getValue(),
      //   footer: "Nickname",
      // },
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
      }
    ],
    []
  );

  useEffect(() => { }, [selectedUser.realUsers, selectedUser.tester]);

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
    const url = `/api/getAllUsers?page=${page}&role=${role}&id=${id}`;
    while (hasMoreData) {
      const res = await axios.get<ArrayUser>(url);
      let { hasMore, users } = res.data;
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
          lastOnline
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
