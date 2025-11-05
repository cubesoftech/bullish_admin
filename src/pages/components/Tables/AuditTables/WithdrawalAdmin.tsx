import { WithdrawalAgentArray, WithdrawalAgent } from "@/utils/interface_v2";
import { GetAgentWithdrawalsResponse } from "@/utils/interfaceV2/interfaces/responses";
import { useAuthentication } from "@/utils/storage";
import {
  VStack,
  TableContainer,
  Table as ChakraTable,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Button,
  HStack,
  Input,
  Text,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  Column,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  Table,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

function WithdrawalAdmin({
  data,
  handleClick,
}: {
  data: GetAgentWithdrawalsResponse;
  handleClick: (id: string) => Promise<void>;
}) {
  const [data_, setData] = useState<GetAgentWithdrawalsResponse>({ data: [] });
  useEffect(() => {
    const newData = data.data.map((withdrawal) => {
      return {
        ...withdrawal,
        email: withdrawal.members?.email,
      };
    });
    setData({ data: newData });
  }, [data]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  let columns = useMemo<ColumnDef<WithdrawalAgent>[]>(
    () => [
      {
        accessorKey: "role",
        header: "역할",
        cell: (info) => info.getValue(),
        accessorFn: (row) => row.role,
      },
      {
        accessorKey: "email",
        header: "은행",
        cell: (info) => info.getValue(),
        footer: "Bank",
      },
      {
        accessorKey: "amount",
        accessorFn: (row) => row.amount.toLocaleString() + " KRW",
        header: "계좌 번호",
        cell: (info) => info.getValue(),
        footer: "Account Number",
      },
      {
        accessorKey: "createdAt",
        header: "계좌 주",
        accessorFn: (row) => new Date(row.createdAt).toDateString(),
        cell: (info) => info.getValue(),
        footer: "Account Holder",
      },
      {
        accessorKey: "status",
        cell: (info) => info.getValue(),
        header: "잔액",
        footer: "Balance",
      },
    ],
    []
  );

  const table = useReactTable({
    columns,
    data: data_.data,
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
      <TableContainer w={"100%"} overflowY={"scroll"} h={"40vh"}>
        <ChakraTable size={"sm"} variant={"striped"} colorScheme="cyan">
          <TableCaption placement="top">정산내역</TableCaption>
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
                        {/* {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : null} */}
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
              return (
                <Tr key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <Td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    );
                  })}

                  <Td>
                    {row.original.status !== "completed" && (
                      <Button
                        onClick={() => {
                          handleClick(row.original.id);
                        }}
                        colorScheme="red"
                        size={"sm"}
                        variant={"outline"}
                      >
                        삭제
                      </Button>
                    )}
                  </Td>
                </Tr>
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
            size={['xs', 'md']}
            onClick={() => table.firstPage()}
            isDisabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </Button>
          <Button
            size={['xs', 'md']}
            onClick={() => table.previousPage()}
            isDisabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </Button>
          <Button
            size={['xs', 'md']}
            onClick={() => table.nextPage()}
            isDisabled={!table.getCanNextPage()}
          >
            {">"}
          </Button>
          <Button
            size={['xs', 'md']}
            onClick={() => table.lastPage()}
            isDisabled={!table.getCanNextPage()}
          >
            {">>"}
          </Button>
        </HStack>

        <HStack fontSize={['xs', 'medium']}>
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
              페이지당 보이기 {pageSize}
            </option>
          ))}
        </Select>
      </HStack>
    </VStack>
  );
}

export default WithdrawalAdmin;

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
