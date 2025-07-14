'use client';

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';

interface CreditInfo {
  category: string;
  required: number;
  limited: number;
  elective: number;
  public: number;
  total: number;
}

export function CreditTable({ data }: { data: CreditInfo[] }) {
  return (
    <div className='w-full overflow-x-auto rounded-md border'>
      <Table className='w-full overflow-x-auto'>
        <TableHeader>
          <TableRow>
            <TableHead>分类</TableHead>
            <TableHead>必修</TableHead>
            <TableHead>限选</TableHead>
            <TableHead>任选</TableHead>
            <TableHead>公选</TableHead>
            <TableHead>总学分</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.category} className='hover:bg-muted'>
              <TableCell className='font-medium'>{item.category}</TableCell>
              <TableCell>{item.required}</TableCell>
              <TableCell>{item.limited}</TableCell>
              <TableCell>{item.elective}</TableCell>
              <TableCell>{item.public}</TableCell>
              <TableCell>{item.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
