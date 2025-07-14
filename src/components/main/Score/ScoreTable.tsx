// ScoreTable.tsx
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

import { BadgeCheck, XCircle } from 'lucide-react';
import { Score, ScoreInfo } from '@/utils/get_score';

export function ScoreTable({ data }: { data: Score }) {
  const columns: ColumnDef<ScoreInfo>[] = [
    {
      accessorKey: 'courseName',
      header: '课程名称',
    },
    {
      accessorKey: 'term',
      header: '学期',
    },
    {
      accessorKey: 'score',
      header: '成绩',
      cell: ({ row }) => (
        <div className='flex items-center gap-2'>
          <span>{row.original.score}</span>
          {row.original.score >= 60 ? (
            <BadgeCheck className='w-4 h-4 text-green-500' />
          ) : (
            <XCircle className='w-4 h-4 text-red-500' />
          )}
        </div>
      ),
    },
    {
      accessorKey: 'credit',
      header: '学分',
    },
    {
      accessorKey: 'gpa',
      header: '绩点',
    },
  ];

  const table = useReactTable({
    data: data.info,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='w-full overflow-x-auto rounded-md border   '>
      <Table className='w-full min-w-[400px] '>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
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
                <TableCell key={cell.id}>
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
