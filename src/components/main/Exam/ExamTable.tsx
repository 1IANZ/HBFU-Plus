'use client';
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

import { ExamSchedule } from '@/utils/get_exam';
import { CalendarDays, MapPin } from 'lucide-react';

interface ExamTableProps {
  data: ExamSchedule[];
}

export function ExamTable({ data }: ExamTableProps) {
  const columns: ColumnDef<ExamSchedule>[] = [
    {
      accessorKey: 'examSession',
      header: '考试场次',
    },
    {
      accessorKey: 'courseName',
      header: '课程名称',
    },
    {
      accessorKey: 'examTime',
      header: '考试时间',
      cell: ({ row }) => (
        <div className='flex items-center gap-1'>
          <CalendarDays className='w-4 h-4 text-muted-foreground' />
          <span>{row.original.examTime}</span>
        </div>
      ),
    },
    {
      accessorKey: 'examLocation',
      header: '考场',
      cell: ({ row }) => (
        <div className='flex items-center gap-1'>
          <MapPin className='w-4 h-4 text-muted-foreground' />
          <span>{row.original.examLocation}</span>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className='w-full overflow-x-auto rounded-md border'>
      <Table className='w-full min-w-[400px]'>
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
