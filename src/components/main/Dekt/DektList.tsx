'use client';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from '@/components/ui/tooltip';
import { Card } from '@/components/ui/card';
import { DEKT } from '@/utils/get_dekt';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DEKTTotal } from '@/utils/get_dekt';
import { DektDetailDialog } from './DEKTDetailDialog';

export function DEKTList({
  data,
  totals,
}: {
  data: DEKT[];
  totals: DEKTTotal[];
}) {
  return (
    <>
      <TooltipProvider>
        <div className="flex flex-col h-[calc(100vh-65px)] px-4 py-4 gap-4">
          {/* Summary */}
          <div className="w-full max-h-[150px] overflow-auto rounded-md border">
            <Table className="w-full min-w-[400px]">
              <TableHeader>
                <TableRow>
                  <TableHead>分类</TableHead>
                  <TableHead>学分</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {totals.map((item) => (
                  <TableRow key={item.category}>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.totalCredit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* DEKT Card List */}
          <div className="flex-1 overflow-auto">
            <div className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(160px,1fr))]">
              {data.map((item) => (
                <DektDetailDialog
                  key={item.id}
                  operationId={item.operationId}
                  trigger={
                    <Card className="p-4 flex flex-col items-start hover:shadow-lg transition cursor-pointer">
                      <h4 className="font-medium line-clamp-2 min-h-[3rem]">
                        {item.activityName || item.subCategory}
                      </h4>
                      <p className="text-xl font-bold mt-2">{item.credit} 学分</p>
                    </Card>
                  }
                />
              ))}
            </div>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
}
