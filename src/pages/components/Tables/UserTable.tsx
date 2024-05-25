import { UserColumn } from "@/utils/interface";
import {
  Table,
  ColumnDef,
  PaginationState,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  Column,
  Row,
  RowSelectionState,
} from "@tanstack/react-table";
import React from "react";
import {
  Table as ChakraTable,
  Thead,
  Th,
  Tr,
  Td,
  Tbody,
  Input,
  HStack,
  VStack,
  Button,
  Select,
  Text,
  useDisclosure,
  Switch,
} from "@chakra-ui/react";
import EditUser from "../Drawer/EditUser";
import { useAuthentication } from "@/utils/storage";

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
  selectedUser: { tester: boolean; realUsers: boolean };
  setSelectedUser: React.Dispatch<
    React.SetStateAction<{
      tester: boolean;
      realUsers: boolean;
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
    <VStack bgColor={"whiteAlpha.800"} w={"100%"} boxShadow={"lg"} p={5}>
      <HStack w={"100%"}>
        <HStack>
          <Button
            isDisabled={
              Object.keys(rowSelection ? rowSelection : {}).length === 0
            }
            onClick={() => {
              //log thw rowSelection object or data to console
              const selectedRows = Object.keys(rowSelection)
                .filter((id) => rowSelection[id])
                .map((id) => data.find((row, key) => key === Number(id)));
              const selectedIds = selectedRows?.map((row) => row?.id);
              //removed the undefined values from the array
              const filteredIds = selectedIds.filter((id) => id);
              console.log(filteredIds);

              const url = "/api/deletebulktransacation";
              const payload = {
                bulkId: filteredIds,
              };
              console.log(payload);
              fetch(url, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
              })
                .then((res) => {
                  refetch();
                  setRowSelection({});
                })
                .catch((error) => {
                  console.log("Error:", error);

                  refetch();
                  setRowSelection({});
                });
            }}
            colorScheme="red"
            size={"sm"}
          >
            선택삭제{" "}
            {Object.keys(rowSelection ? rowSelection : {}).length === 0}
          </Button>
          <Text>가라유저</Text>
          <Switch
            onChange={(e) => {
              setSelectedUser({ ...selectedUser, tester: e.target.checked });
              setRefetch(true);
            }}
            isChecked={selectedUser.tester}
          ></Switch>
        </HStack>
        <HStack>
          <Text>실유저</Text>
          <Switch
            isChecked={selectedUser.realUsers}
            onChange={(e) => {
              setRefetch(true);

              setSelectedUser({ ...selectedUser, realUsers: e.target.checked });
            }}
          ></Switch>
        </HStack>
      </HStack>

      <ChakraTable size={"sm"} variant={"striped"} colorScheme="cyan">
        <Thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <Tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <Th key={header.id} colSpan={header.colSpan}>
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
      <HStack
        w={"100%"}
        display="flex"
        alignItems="center"
        justifyContent={"space-between"}
        gap={2}
      >
        <HStack>
          <Button
            onClick={() => table.firstPage()}
            isDisabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            onClick={() => table.previousPage()}
            isDisabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <Button
            onClick={() => table.nextPage()}
            isDisabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
          <Button
            onClick={() => table.lastPage()}
            isDisabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
        </HStack>

        <HStack>
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
  return (
    <Tr key={row.id}>
      <EditUser
        refetch={refetch}
        isOpen={isOpen}
        onClose={onClose}
        user={row.original}
      />
      {row.getVisibleCells().map((cell) => {
        console.log(cell.getContext(), cell.id);
        return (
          <Td key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Td>
        );
      })}
      {role === "ADMIN" && (
        <Td>
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
            onClick={() => {
              const url = "/api/deleteuser";
              const payload = {
                id: row.original.id,
              };
              fetch(url, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
              })
                .then((res) => {
                  refetch();
                })
                .catch((error) => {
                  console.log("Error:", error);
                  refetch();
                });
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

  const disableHeader = ["은행", "계좌 번호", "계좌 주", "잔액"];
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
      w={150}
      size={"sm"}
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
