import { User, GetIncomeInterface } from "@/utils/interface_v2";
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
  Tfoot,
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

function WithdrawalNonAdmin({ data }: { data: GetIncomeInterface }) {
  const [data_, setData] = useState<User[]>(data.users);

  useEffect(() => {
    setData(data.users);
  }, [data]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { role } = useAuthentication();
  let columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: "이름",
        cell: (info) => info.getValue(),
        accessorFn: (row) => row.name,
        footer: "Total",
      },
      {
        accessorKey: "balance",
        header: "은행",
        accessorFn: (row) => row.balance,
        cell: (info) => info.getValue(),
        footer: ({ table }) => {
          const filteredrows = table.getFilteredRowModel();
          const total = filteredrows.flatRows.reduce(
            (acc, row) => acc + row.original.balance,
            0
          );
          return `${total.toLocaleString()} KRW`;
        },
      },
      {
        accessorKey: "withdrawal",
        accessorFn: (row) => row.withdrawals,
        header: "계좌 번호",
        cell: (info) => info.getValue(),
        footer: ({ table }) => {
          const filteredrows = table.getFilteredRowModel();
          const total = filteredrows.flatRows.reduce(
            (acc, row) => acc + row.original.withdrawals,
            0
          );
          return `${total.toLocaleString()} KRW`;
        },
      },
    ],
    []
  );

  if (role === "ADMIN") {
    columns.push(
      {
        accessorKey: "masterAgentId",
        header: "Master Agent",
        cell: (info) => info.getValue(),
        accessorFn: (row) => row.masterAgentID,
      },
      {
        accessorKey: "referrer",
        header: "Agent",
        cell: (info) => info.getValue(),
        accessorFn: (row) => row.referrer,
      },
      {
        accessorKey: "operator_gross_income",
        header: "본사매출",
        accessorFn: (row) => row.operator_gross_income,
        cell: (info) => info.getValue(),
        footer: ({ table }) => {
          const filteredrows = table.getFilteredRowModel();
          const total = filteredrows.flatRows.reduce(
            (acc, row) => acc + row.original.operator_gross_income,
            0
          );
          return `${total.toLocaleString()} KRW`;
        },
      },
      {
        accessorKey: "operator_net_income",
        header: "본사수익",
        accessorFn: (row) => row.operator_net_income,
        cell: (info) => info.getValue(),
        footer: ({ table }) => {
          const filteredrows = table.getFilteredRowModel();
          const total = filteredrows.flatRows.reduce(
            (acc, row) => acc + row.original.operator_net_income,
            0
          );
          return `${total.toLocaleString()} KRW`;
        },
      },
      {
        accessorKey: "master_agent_gross_income",
        header: "총 입금액",
        accessorFn: (row) => row.master_agent_gross_income,
        cell: (info) => info.getValue(),
        footer: ({ table }) => {
          const filteredrows = table.getFilteredRowModel();
          const total = filteredrows.flatRows.reduce(
            (acc, row) => acc + row.original.master_agent_gross_income,
            0
          );
          return `${total.toLocaleString()} KRW`;
        },
      },
      {
        accessorKey: "master_agent_net_income",
        header: "총 출금액",
        accessorFn: (row) => row.master_agent_net_income,
        cell: (info) => info.getValue(),
        footer: ({ table }) => {
          const filteredrows = table.getFilteredRowModel();
          const total = filteredrows.flatRows.reduce(
            (acc, row) => acc + row.original.master_agent_net_income,
            0
          );
          return `${total.toLocaleString()} KRW`;
        },
      },
      {
        accessorKey: "agent_gross_income",
        header: "에이전트매출",
        accessorFn: (row) => row.agent_gross_income,
        cell: (info) => info.getValue(),
        footer: ({ table }) => {
          const filteredrows = table.getFilteredRowModel();
          const total = filteredrows.flatRows.reduce(
            (acc, row) => acc + row.original.agent_gross_income,
            0
          );
          return `${total.toLocaleString()} KRW`;
        },
      },
      {
        accessorKey: "agent_net_income",
        header: "에이전트수익",
        accessorFn: (row) => row.agent_net_income,
        cell: (info) => info.getValue(),
        footer: ({ table }) => {
          const filteredrows = table.getFilteredRowModel();
          const total = filteredrows.flatRows.reduce(
            (acc, row) => acc + row.original.agent_net_income,
            0
          );
          return `${total.toLocaleString()} KRW`;
        },
      }
    );
  } else if (role === "MASTER_AGENT") {
    columns.push(
      {
        accessorKey: "referrer",
        header: "Agent",
        cell: (info) => info.getValue(),
        accessorFn: (row) => row.referrer,
      },
      {
        accessorKey: "master_agent_gross_income",
        header: "총 입금액",
        accessorFn: (row) => row.master_agent_gross_income,
        cell: (info) => info.getValue(),
        footer: "Total Deposit",
      },
      {
        accessorKey: "master_agent_net_income",
        header: "총 출금액",
        accessorFn: (row) => row.master_agent_net_income,
        cell: (info) => info.getValue(),
        footer: "Total Withdrawal",
      },
      {
        accessorKey: "agent_gross_income",
        header: "에이전트매출",
        accessorFn: (row) => row.agent_gross_income,
        cell: (info) => info.getValue(),
        footer: "Agent Gross Income",
      },
      {
        accessorKey: "agent_net_income",
        header: "에이전트수익",
        accessorFn: (row) => row.agent_net_income,
        cell: (info) => info.getValue(),
        footer: ({ table }) => {
          const filteredrows = table.getFilteredRowModel();
          const total = filteredrows.flatRows.reduce(
            (acc, row) => acc + row.original.agent_net_income,
            0
          );
          return `${total.toLocaleString()} KRW`;
        },
      }
    );
  } else if (role === "AGENT") {
    columns.push(
      {
        accessorKey: "agent_gross_income",
        header: "에이전트매출",
        accessorFn: (row) => row.agent_gross_income,
        cell: (info) => info.getValue(),
        footer: "Agent Gross Income",
      },
      {
        accessorKey: "agent_net_income",
        header: "에이전트수익",
        accessorFn: (row) => row.agent_net_income,
        cell: (info) => info.getValue(),
        footer: "Agent Net Income",
      }
    );
  }

  const table = useReactTable({
    columns,
    data: data_,
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

  return (
    <VStack bgColor={"whiteAlpha.800"} w={"100%"} boxShadow={"lg"} p={5}>
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
                </Tr>
              );
            })}
          </Tbody>
          <Tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <Tr key={footerGroup.id}>
                {footerGroup.headers.map((footer) => (
                  <Th key={footer.id}>
                    {flexRender(
                      footer.column.columnDef.footer,
                      footer.getContext()
                    )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Tfoot>
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
          w={"fit-content"}
          size={['xs', 'md']}
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

export default WithdrawalNonAdmin;

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

  if (typeof firstValue === "number") {
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
