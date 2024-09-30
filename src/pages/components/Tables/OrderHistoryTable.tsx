import { OrderHistoryColumnInterface } from "@/utils/interface";
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
  Flex,
  Switch,
  TableContainer,
} from "@chakra-ui/react";
import OrderHistoryDrawer from "../Drawer/OrderHistoryDrawer";

export default function OrderHistoryTable({
  data,
  columns,
  pagination,
  setPagination,
  rowSelection,
  selectedUser,
  setSelectedUser,
  setRowSelection,
  setRefetch,
}: {
  data: OrderHistoryColumnInterface[];
  columns: ColumnDef<OrderHistoryColumnInterface>[];
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<{}>>;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  selectedUser: { tester: boolean; realUsers: boolean };
  setSelectedUser: React.Dispatch<
    React.SetStateAction<{
      tester: boolean;
      realUsers: boolean;
    }>
  >;
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

  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <VStack bgColor={"whiteAlpha.800"} w={"100%"} boxShadow={"lg"} p={5}>
      <HStack w={"100%"}>
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

            const url = "/api/deletebulktransacation";
            const payload = {
              bulkId: filteredIds,
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
                setRowSelection({});
              })
              .catch((error) => {
                refetch();
                setRowSelection({});
              });
          }}
          colorScheme="red"
          size={"sm"}
        >
          선택삭제 {Object.keys(rowSelection ? rowSelection : {}).length === 0}
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
        </Flex>
      </HStack>
      <TableContainer fontSize={["xs", "sm"]} w={"100%"}>
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
                <Th>수정</Th>
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => {
              return <OrderHistoryRow key={row.id} row={row} />;
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
          size={['xs', 'md']}
          w={"fit-content"}
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[1, 10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              보여주다 {pageSize}
            </option>
          ))}
        </Select>
      </HStack>
    </VStack>
  );
}

function OrderHistoryRow({ row }: { row: Row<OrderHistoryColumnInterface> }) {
  const data = row.original;
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Tr key={row.id}>
      {row.getVisibleCells().map((cell) => {
        return (
          <Td key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Td>
        );
      })}
      <Td>
        <OrderHistoryDrawer
          isOpen={isOpen}
          onClose={onClose}
          OrderHistoryColumn={data}
        />
        <Button
          onClick={onOpen}
          colorScheme="orange"
          size={"sm"}
          variant={"outline"}
        >
          수정
        </Button>
      </Td>
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

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === "number" ? null : (
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
