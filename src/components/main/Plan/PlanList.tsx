'use client';

import { Card } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ExecutionPlan } from '@/utils/get_zxjh';
import { PlanTable } from './PlanTable';

export function PlanList({
  data,
  model,
}: {
  data: ExecutionPlan[];
  model: boolean;
}) {
  return (
    <TooltipProvider>
      <div className='flex flex-col h-[calc(100vh-100px)] px-4 py-4'>
        {model ? (
          <div className='flex-1 overflow-auto min-h-0 [scrollbar-gutter:stable] w-full'>
            <PlanTable data={data} />
          </div>
        ) : (
          <div className='flex-1 overflow-y-auto min-h-0 [scrollbar-gutter:stable] w-full'>
            <div className='grid gap-4 grid-cols-[repeat(auto-fit,minmax(160px,1fr))]'>
              {data.map((plan) => (
                <Tooltip key={plan.id}>
                  <TooltipTrigger asChild>
                    <Card className='p-4 flex flex-col items-start hover:shadow-md transition'>
                      <h4 className='font-bold line-clamp-2 min-h-[3rem]'>
                        {plan.courseName}
                      </h4>
                      <div className='mt-auto flex justify-between w-full text-sm font-bold text-green-600 dark:text-green-400'>
                        <span>学分: {plan.credits}</span>
                        <span>{plan.courseType}</span>
                      </div>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent className='text-xs'>
                    <div>课程代码: {plan.courseCode}</div>
                    <div>课程类型: {plan.courseType}</div>
                    <div>学分: {plan.credits}</div>
                    <div>总学时: {plan.totalHours}</div>
                    <div>考核方式: {plan.assessmentMethod}</div>
                    <div>是否考试: {plan.isExam}</div>
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
