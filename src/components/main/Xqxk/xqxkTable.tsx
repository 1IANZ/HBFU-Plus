'use client';

import * as React from 'react';
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

import { XqxkchInfo } from '@/utils/get_xqxkch';

export function XqxkTable({ data }: { data: XqxkchInfo[] }) {
  const columns: ColumnDef<XqxkchInfo>[] = [
    {
      accessorKey: 'course_id',
      header: '课程号',
    },
    {
      accessorKey: 'course_name',
      header: '课程名称',
    },
    {
      accessorKey: 'department',
      header: '开课单位',
    },
    {
      accessorKey: 'hours',
      header: '学时',
      cell: (info) => info.getValue<number>(),
    },
    {
      accessorKey: 'credits',
      header: '学分',
      cell: (info) => info.getValue<number>(),
    },
    {
      accessorKey: 'course_attribute',
      header: '课程属性',
    },
    {
      accessorKey: 'selection_type',
      header: '选课类型',
    },
    {
      accessorKey: 'selected',
      header: '选中状态',
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='fixed w-[calc(100vw-200px)] max-w-full max-h-[calc(100vh-140px)] overflow-auto border rounded-md'>
      <Table className='w-full'>
        <TableHeader className='sticky top-0 z-10 bg-background'>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className='whitespace-nowrap px-4 py-2 text-left text-sm font-medium'
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className='whitespace-nowrap px-4 py-2 text-sm'
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
