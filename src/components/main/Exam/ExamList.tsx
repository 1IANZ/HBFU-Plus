'use client';

import { Card } from '@/components/ui/card';
import { CalendarDays, MapPin } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ExamSchedule } from '@/utils/get_exam';
import { ExamTable } from './ExamTable';

export function ExamList({
  data,
  model,
}: {
  data: ExamSchedule[];
  model: boolean;
}) {
  return (
    <TooltipProvider>
      <div className='flex flex-col h-full px-4 py-4'>
        {model ? (
          <div className='flex-1 overflow-auto min-h-0 [scrollbar-gutter:stable] w-full'>
            <ExamTable data={data} />
          </div>
        ) : (
          <div className='flex-1 overflow-y-auto min-h-0 [scrollbar-gutter:stable] w-full'>
            <div className='grid gap-4 grid-cols-[repeat(auto-fit,minmax(220px,1fr))]'>
              {data.map((exam) => (
                <Tooltip key={exam.id}>
                  <TooltipTrigger asChild>
                    <Card className='flex flex-col items-start hover:shadow-md transition p-4'>
                      <h4 className='font-bold line-clamp-2 min-h-[3rem]'>
                        {exam.courseName}
                      </h4>

                      <div className='mt-2 flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300'>
                        <CalendarDays className='w-4 h-4' />
                        <span>{exam.examTime}</span>
                      </div>

                      <div className='mt-1 flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300'>
                        <MapPin className='w-4 h-4' />
                        <span>{exam.examLocation}</span>
                      </div>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent className='text-xs'>
                    <div>课程名称: {exam.courseName}</div>
                    <div>考试时间: {exam.examTime}</div>
                    <div>考场: {exam.examLocation}</div>
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
