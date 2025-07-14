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

import { ExecutionPlan } from '@/utils/get_zxjh';

export function PlanTable({ data }: { data: ExecutionPlan[] }) {
  const columns: ColumnDef<ExecutionPlan>[] = [
    {
      accessorKey: 'courseCode',
      header: '课程编号',
    },
    {
      accessorKey: 'courseName',
      header: '课程名称',
    },
    {
      accessorKey: 'department',
      header: '开课单位',
    },
    {
      accessorKey: 'totalHours',
      header: '总学时',
      cell: (info) => info.getValue<number>(),
    },
    {
      accessorKey: 'credits',
      header: '学分',
      cell: (info) => info.getValue<number>(),
    },
    {
      accessorKey: 'assessmentMethod',
      header: '考核方式',
    },
    {
      accessorKey: 'courseType',
      header: '课程属性',
    },
    {
      accessorKey: 'isExam',
      header: '是否考试',
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
