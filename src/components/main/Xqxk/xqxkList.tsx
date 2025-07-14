// components/xqxk/xqxkList.tsx
'use client';

import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { XqxkchInfo } from '@/utils/get_xqxkch';
import { XqxkTable } from './xqxkTable';

export function XqxkList({
  data,
  model,
}: {
  data: XqxkchInfo[];
  model: boolean;
}) {
  return (
    <TooltipProvider>
      <div className='flex flex-col h-[calc(100vh-100px)] px-4 py-4'>
        {model ? (
          <div className='flex-1 overflow-auto min-h-0 [scrollbar-gutter:stable] w-full p-1'>
            <XqxkTable data={data} />
          </div>
        ) : (
          <div className='flex-1 overflow-y-auto min-h-0 [scrollbar-gutter:stable] w-full'>
            <div className='grid gap-4 grid-cols-[repeat(auto-fit,minmax(160px,1fr))] '>
              {data.map((item) => (
                <Tooltip key={item.course_id}>
                  <TooltipTrigger asChild>
                    <Card className='p-4 flex flex-col items-start hover:shadow-md transition'>
                      <h4 className='font-bold line-clamp-2 min-h-[3rem]'>
                        {item.course_name}
                      </h4>
                      <p className='text-sm mt-1 font-bold  text-blue-600 dark:text-blue-400'>
                        学分: {item.credits} | 学时: {item.hours}
                      </p>
                      <p className='text-sm text-green-600 dark:text-green-400'>
                        {item.department}
                      </p>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent className='text-xs'>
                    <div>课程号: {item.course_id}</div>
                    <div>开课单位: {item.department}</div>
                    <div>课程属性: {item.course_attribute}</div>
                    <div>选课类型: {item.selection_type}</div>
                    <div>选中状态: {item.selected}</div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
