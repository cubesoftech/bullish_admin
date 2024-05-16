import { InquryColumn } from "@/utils/interface";
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
} from "@chakra-ui/react";
import EditInqury from "../Drawer/EditInqury";

export default function InquiryTable({
  data,
  columns,
  pagination,
  setPagination,
  refetch,
}: {
  data: InquryColumn[];
  columns: ColumnDef<InquryColumn>[];
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  refetch: () => void;
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
    },
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
  });

  return (
    <VStack bgColor={"whiteAlpha.800"} w={"100%"} boxShadow={"lg"} p={5}>
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
              <Th>Action</Th>
            </Tr>
          ))}
        </Thead>
        <Tbody>
          {table.getRowModel().rows.map((row) => {
            return <InquiryTableRow row={row} />;
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

function InquiryTableRow({
  row,
}: {
  row: Row<InquryColumn>;
}): React.JSX.Element {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const inqury = row.original;
  return (
    <Tr key={row.id}>
      <EditInqury inqury={inqury} isOpen={isOpen} onClose={onClose} />
      {row.getVisibleCells().map((cell) => {
        return (
          <Td key={cell.id}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </Td>
        );
      })}
      <Td>
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
