'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { useDektDetail } from '@/hooks/useDekt';

interface DektDetailDialogProps {
  operationId: string;
  trigger: React.ReactNode;
}

export function DektDetailDialog({
  operationId,
  trigger,
}: DektDetailDialogProps) {
  const detail = useDektDetail(operationId);
  const entries = detail ? Object.entries(detail) : [];

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='max-h-[calc(100vh-100px)] overflow-y-auto rounded-lg bg-white dark:bg-gray-900 shadow-xl p-6'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-semibold text-primary-600 dark:text-primary-400'>
            学分活动详情
          </DialogTitle>
          <DialogDescription className='mt-1 text-sm text-gray-500 dark:text-gray-400'>
            查看活动的详细信息。
          </DialogDescription>
        </DialogHeader>

        <div className='mt-6 min-h-[150px] grid grid-cols-2 gap-4 overflow-y-auto'>
          {detail &&
            entries.map(([label, value]) => (
              <DetailItem key={label} label={label} value={value} />
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <Card className='p-3 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-colors duration-200'>
      <div className='text-xs font-medium text-gray-600 dark:text-gray-400 mb-1'>
        {label}
      </div>
      <div className='text-sm font-semibold text-gray-900 dark:text-gray-100'>
        {value || '无'}
      </div>
    </Card>
  );
}
