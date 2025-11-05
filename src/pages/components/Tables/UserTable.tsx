import { UserColumn } from "@/utils/interface";
import { Table, ColumnDef, PaginationState, useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender, Column, Row, RowSelectionState, } from "@tanstack/react-table";
import React, { useState, useEffect } from "react";
import { Stack, Input, HStack, VStack, Button, Select, Text, useDisclosure, Switch, Flex, useColorModeValue } from "@chakra-ui/react";
import { Popover, PopoverTrigger, PopoverContent, PopoverHeader, PopoverBody, PopoverFooter, PopoverArrow, PopoverCloseButton, PopoverAnchor, } from '@chakra-ui/react'
import { Table as ChakraTable, Thead, Th, Tr, Td, Tbody, TableContainer } from "@chakra-ui/react"
import { NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper, } from "@chakra-ui/react"
import EditUser from "../Drawer/EditUser";
import { useAuthentication } from "@/utils/storage";
import InjectSetting from "../Drawer/InjectSetting";
import { CSVLink } from "react-csv";
import NewInjectSetting from "../Drawer/NewInjectSetting";
import api from "@/utils/interfaceV2/api";

export default function UserTable({
  data,
  columns,
  pagination,
  setPagination,
  setRefetch,
  selectedUser,
  setSelectedUser,
  rowSelection,
  setRowSelection,
}: {
  data: UserColumn[];
  columns: ColumnDef<UserColumn>[];
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUser: { tester: boolean; realUsers: boolean, lastOnline: boolean };
  setSelectedUser: React.Dispatch<
    React.SetStateAction<{
      tester: boolean;
      realUsers: boolean;
      lastOnline: boolean;
    }>
  >;
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<{}>>;
}) {
  const refetch = () => {
    setRefetch(true);
  };


  const table = useReactTable({
    columns,
    data,
    debugTable: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      pagination,
      rowSelection,
    },
    enableMultiRowSelection: true,
    onRowSelectionChange: setRowSelection,
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
  });

  const { role } = useAuthentication();

  return (
    <VStack bgColor={useColorModeValue("whiteAlpha.800", "gray.700")} w={"100%"} boxShadow={"lg"} p={5}>
      <Flex justifyContent={'space-between'} w={'100%'}>
        <Button
          isDisabled={
            Object.keys(rowSelection ? rowSelection : {}).length === 0
          }
          onClick={async () => {
            //log thw rowSelection object or data to console
            const selectedRows = Object.keys(rowSelection)
              .filter((id) => rowSelection[id])
              .map((id) => data.find((row, key) => key === Number(id)));
            const selectedIds = selectedRows?.map((row) => row?.id);
            //removed the undefined values from the array
            const filteredIds = selectedIds.filter((id) => id);

            try {
              await api.deleteTransactions({
                transactionIds: filteredIds as string[],
              })
              refetch();
              setRowSelection({});
            } catch (error) {
              refetch();
              setRowSelection({});
            }
          }}
          colorScheme="red"
          size={["xs", "sm"]}
        >
          선택삭제{" "}
          {Object.keys(rowSelection ? rowSelection : {}).length === 0}
        </Button>
        <Flex mr={2} ml={5} direction={['column', 'row']} w={"100%"}>
          <HStack m={1}>

            <Text fontSize={['x-small', 'medium']}>가라유저</Text>
            <Switch
              size={['sm', "md"]}
              onChange={(e) => {
                setSelectedUser({ ...selectedUser, tester: e.target.checked });
                setRefetch(true);
              }}
              isChecked={selectedUser.tester}
            ></Switch>
          </HStack>
          <HStack m={1}>
            <Text fontSize={['x-small', 'medium']}>실유저</Text>
            <Switch
              size={['sm', "md"]}
              isChecked={selectedUser.realUsers}
              onChange={(e) => {
                setRefetch(true);

                setSelectedUser({ ...selectedUser, realUsers: e.target.checked });
              }}
            ></Switch>
          </HStack>
          <HStack m={1}>
            <Text fontSize={['x-small', 'medium']}>Online Users</Text>
            <Switch
              size={['sm', "md"]}
              isChecked={selectedUser.lastOnline}
              onChange={(e) => {
                setRefetch(true);
                setSelectedUser({ ...selectedUser, lastOnline: e.target.checked });
              }}
            ></Switch>
          </HStack>
        </Flex>
        <CSVLink data={data} filename={"users.csv"}>
          <Button
            colorScheme="blue"
            size={'xs'}
          >
            Download CSV
          </Button>
        </CSVLink>
      </Flex>

      <TableContainer w={'100%'}>
        <ChakraTable size={"sm"} variant={"striped"} colorScheme={useColorModeValue("blue", "green")}>
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <Th color={useColorModeValue('black', 'white')} key={header.id} colSpan={header.colSpan}>
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null}
                      </div>
                    </Th>
                  );
                })}
                {role === "ADMIN" && <Th>Action</Th>}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => {
              return <UserRow refetch={refetch} key={row.id} row={row} />;
            })}
          </Tbody>
        </ChakraTable>
      </TableContainer>


      <HStack
        w={"100%"}
        display="flex"
        alignItems="center"
        justifyContent={"space-between"}
        gap={2}
      >
        <HStack>
          <Button
            size={['xs', "sm"]}
            onClick={() => table.firstPage()}
            isDisabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            size={['xs', "sm"]}
            onClick={() => table.previousPage()}
            isDisabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <Button
            size={['xs', "sm"]}
            onClick={() => table.nextPage()}
            isDisabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
          <Button
            size={['xs', "sm"]}
            onClick={() => table.lastPage()}
            isDisabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
        </HStack>

        <HStack fontSize={['xs', 'md']}>
          <Text>Page</Text>
          <Text
            w={"fit-content"}
            noOfLines={1}
            fontWeight="bold"
            whiteSpace="nowrap"
          >
            {`${table.getState().pagination.pageIndex + 1} of ${table
              .getPageCount()
              .toLocaleString()}`}
          </Text>
        </HStack>

        <Select
          size={['xs', 'sm']}
          w={"fit-content"}
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[1, 10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              페이지당 보이기 {pageSize}
            </option>
          ))}
        </Select>
      </HStack>
    </VStack>
  );
}

function UserRow({
  row,
  refetch,
}: {
  row: Row<UserColumn>;
  refetch: () => void;
}): React.JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { role } = useAuthentication();
  const injectSetting = useDisclosure();

  return (
    <Tr key={row.id}>
      <EditUser
        refetch={refetch}
        isOpen={isOpen}
        onClose={onClose}
        user={row.original}
      />
      {row.getVisibleCells().map((cell, index) => {
        const { status, bank, accountholder, accountnumber } = row.original;
        const columnHeader = cell.column.columnDef.header
        if (columnHeader === "은행" || columnHeader === "계좌 번호" || columnHeader === "계좌 주") {
          return (
            <Td key={cell.id} color={useColorModeValue(status ? "black" : "red", status ? "white" : "red")}>
              ***
            </Td>
          );
        }
        return (
          <Td key={cell.id} color={useColorModeValue(status ? "black" : "red", status ? "white" : "red")}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Td>
        );
      })}
      {
        role !== "ADMIN" && (
          <Td>
            <Popover placement="bottom">
              <PopoverTrigger>
                <Button
                  onClick={injectSetting.onOpen}
                  colorScheme="blue"
                  size={"sm"}
                  variant={"outline"}
                  mr={1}
                >
                  설정 적용
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverBody p={3} shadow={"2xl"}>
                  <NewInjectSetting user={row.original} {...injectSetting} />
                </PopoverBody>
              </PopoverContent>
            </Popover>
            <Button
              onClick={onOpen}
              colorScheme="blue"
              size={"sm"}
              variant={"outline"}
              mr={1}
            >
              수정
            </Button>
          </Td>
        )
      }
      {role === "ADMIN" && (
        <Td>
          <Popover placement="bottom">
            <PopoverTrigger>
              <Button
                onClick={injectSetting.onOpen}
                colorScheme="blue"
                size={"sm"}
                variant={"outline"}
                mr={1}
              >
                설정 적용
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverBody p={3} shadow={"2xl"}>
                <NewInjectSetting user={row.original} {...injectSetting} />
              </PopoverBody>
            </PopoverContent>
          </Popover>
          <Button
            onClick={onOpen}
            colorScheme="blue"
            size={"sm"}
            variant={"outline"}
            mr={1}
          >
            수정
          </Button>
          <Button
            onClick={async () => {
              try {
                await api.deleteUsers({
                  userIds: [row.original.id]
                })
              } catch (error) {
                console.log(error);
              } finally {
                refetch();
              }
            }}
            colorScheme="red"
            size={"sm"}
            variant={"outline"}
          >
            삭제
          </Button>
        </Td>
      )}
    </Tr>
  );
}

function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const disableHeader = ["은행", "계좌 번호", "계좌 주", "잔액", "가입일순", "최근접속순", "강제 로그아웃", "역방향 베팅", "거래 수정", "Max"];
  if (disableHeader.includes(column?.columnDef?.header as string)) {
    return null;
  }

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === "number" ? (
    <HStack
      spacing={1}
      className="flex space-x-2"
      onClick={(e) => e.stopPropagation()}
    >
      <Input
        w={100}
        border={"1px"}
        borderColor={"gray.300"}
        size={"sm"}
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder={`Min`}
        className="w-24 border shadow rounded"
      />
      <Input
        w={100}
        border={"1px"}
        borderColor={"gray.300"}
        size={"sm"}
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ""}
        onChange={(e) =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder={`Max`}
        className="w-24 border shadow rounded"
      />
    </HStack>
  ) : (
    <Input
      w={70}
      size={"sm"}
      padding={1}
      border={"1px"}
      borderColor={"gray.300"}
      onChange={(e) => column.setFilterValue(e.target.value)}
      onClick={(e) => e.stopPropagation()}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? "") as string}
    />
  );
}
