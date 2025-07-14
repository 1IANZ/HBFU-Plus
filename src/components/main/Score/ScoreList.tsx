import { Card } from '@/components/ui/card';
import { BadgeCheck, XCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Score } from '@/utils/get_score';
import { ScoreTable } from './ScoreTable';

export function ScoreList({ data, model }: { data: Score; model: boolean }) {
  const { passCount, failCount } = data.info.reduce(
    (acc, item) => {
      if (item.score >= 60) {
        acc.passCount += 1;
      } else {
        acc.failCount += 1;
      }
      return acc;
    },
    { passCount: 0, failCount: 0 }
  );

  return (
    <TooltipProvider>
      <div className='flex flex-col h-[calc(100vh-100px)] px-4 py-4'>
        {/* Summary */}
        <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 border p-4 rounded-lg mb-4'>
          <div>
            总学分:{' '}
            <span className='font-bold'>{data.summary.creditTotal}</span>
          </div>
          <div>
            平均绩点:{' '}
            <span className='font-bold'>
              {data.summary.gpaAverage.toFixed(2)}
            </span>
          </div>
          <div>
            通过: <span className='font-bold text-green-600'>{passCount}</span>{' '}
            门
          </div>
          <div>
            挂科: <span className='font-bold text-red-600'>{failCount}</span> 门
          </div>
        </div>
        {/* Score List */}
        {model ? (
          <div className='flex-1 overflow-auto min-h-0 [scrollbar-gutter:stable] w-full '>
            <ScoreTable data={data} />
          </div>
        ) : (
          <div className='flex-1 overflow-y-auto min-h-0 [scrollbar-gutter:stable] w-full '>
            <div className='grid gap-4 grid-cols-[repeat(auto-fit,minmax(160px,1fr))]'>
              {data.info.map((item) => (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>
                    <Card className='p-4 flex flex-col items-start hover:shadow-md transition'>
                      <div className='flex justify-between w-full items-center'>
                        <h4 className='font-medium line-clamp-2 min-h-[3rem] overflow-hidden'>
                          {item.courseName}
                        </h4>
                        {item.score >= 60 ? (
                          <BadgeCheck className='text-green-500 w-5 h-5' />
                        ) : (
                          <XCircle className='text-red-500 w-5 h-5' />
                        )}
                      </div>
                      <p className='text-xl font-bold mt-2'>{item.score}</p>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent className='text-xs'>
                    <div>学期: {item.term}</div>
                    <div>学分: {item.credit}</div>
                    <div>绩点: {item.gpa}</div>
                    <div>考试类型: {item.examType}</div>
                    <div>课程属性: {item.courseAttr}</div>
                    <div>课程性质: {item.courseNature}</div>
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
