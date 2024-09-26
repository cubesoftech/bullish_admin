import { TransactionColumn } from "@/utils/interface";
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
  TableContainer,
} from "@chakra-ui/react";
import EditTransaction from "../Drawer/EditTransaction";
import { useAuthentication } from "@/utils/storage";
import { CSVLink } from 'react-csv';

export default function TransactionTable({
  data,
  columns,
  pagination,
  setPagination,
  isWithdrawal,
  refetch,
  rowSelection,
  setRowSelection,
}: {
  data: TransactionColumn[];
  columns: ColumnDef<TransactionColumn>[];
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  isWithdrawal: boolean;
  refetch: () => void;
  rowSelection: RowSelectionState;
  setRowSelection: React.Dispatch<React.SetStateAction<{}>>;
}) {
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
  const isAdmin = role === "ADMIN";
  return (
    <VStack bgColor={"whiteAlpha.800"} w={"100%"} boxShadow={"lg"} p={5}>
      <HStack w={"100%"} justifyContent={"space-between"}>
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
          size={['xs', "sm"]}
        >
          선택삭제 {Object.keys(rowSelection ? rowSelection : {}).length === 0}
        </Button>
        <CSVLink data={data} filename={"transaction.csv"}>
          <Button
            colorScheme="blue"
            size={['xs', "sm"]}
          >
            Download CSV
          </Button>
        </CSVLink>

      </HStack>
      <TableContainer w={'100%'}>
        <ChakraTable
          overflowY={"scroll"}
          size={'sm'}
          variant={"striped"}
          colorScheme="messenger"
        >
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
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <TransactionRow
                  row={row}
                  isWithdrawal={isWithdrawal}
                  refetch={refetch}
                />
              );
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

function TransactionRow({
  row,
  isWithdrawal,
  refetch,
}: {
  row: Row<TransactionColumn>;
  isWithdrawal: boolean;
  refetch: () => void;
}): React.JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { role } = useAuthentication();
  const isAdmin = role === "ADMIN";
  const status = row.original.status;
  return (
    <Tr key={row.id}>
      <EditTransaction
        isOpen={isOpen}
        isWithdrawal={isWithdrawal}
        onClose={onClose}
        transaction={row.original}
        refetch={refetch}
      />
      {row.getVisibleCells().map((cell) => {
        return (
          <Td
            className={row.getIsSelected() ? "selected" : undefined}
            onClick={row.getToggleSelectedHandler()}
            key={cell.id}
            color={status === "completed" ? "black" : "red"}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Td>
        );
      })}
      {isAdmin && (
        <Td>
          <Button
            onClick={onOpen}
            colorScheme="orange"
            size={["xs", "sm"]}
            variant={"outline"}
          >
            수정
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
  const columnFilterValue = column.getFilterValue();
  //return null depending on the column header
  const disbledHeader = [
    "은행",
    "계좌 번호",
    "계좌 주",
    "금액",
    "요청 날짜",
    "상태",
  ];
  if (disbledHeader.includes(column?.columnDef?.header as string)) {
    return null;
  }
  return (
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
