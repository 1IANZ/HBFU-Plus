'use client';
import { SemesterCombox } from '@/components/Combobox';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import useSemester from '@/hooks/useSemester';
import { ExamList } from '@/components/main/Exam/ExamList';
import { ExamSchedule, getExam } from '@/utils/get_exam';
import { Card, CardContent } from '@/components/ui/card';

export default function Page() {
  const semesters = useSemester(false);
  const [model, setModel] = useState<boolean>(false);
  const [examData, setExamData] = useState<ExamSchedule[] | null>(null);
  const [currentSemester, setCurrentSemester] = useState<string>('');

  async function fetchExam(semester: string) {
    const s = await getExam(semester);
    setExamData(s);
  }

  useEffect(() => {
    if (semesters && currentSemester === '') {
      setCurrentSemester(semesters[1]);
    }
  }, [semesters]);

  useEffect(() => {
    if (currentSemester) {
      fetchExam(currentSemester);
    }
  }, [currentSemester]);

  return (
    <>
      <div className='flex gap-2 w-[calc(100vw-140px)] px-8'>
        <SemesterCombox
          data={semesters || []}
          value={currentSemester}
          onChange={(value: string) => setCurrentSemester(value)}
        />

        <div className='flex items-center space-x-2 justify-end w-full'>
          <Switch id='model' checked={model} onCheckedChange={setModel} />
          <Label htmlFor='model'>{model ? '列表' : '卡片'}</Label>
        </div>
      </div>

      <div className='h-[calc(100vh-100px)] overflow-y-auto'>
        <div className='mx-auto px-4'>
          {examData?.length ? (
            <ExamList data={examData} model={model} />
          ) : (
            <div className='flex items-center justify-center h-[300px]'>
              <Card className='w-full max-w-md text-center'>
                <CardContent className='p-6'>
                  <p className='text-xl font-semibold text-pink-400 mb-2'>
                    🥰 哎呀，考试还没安排哦！
                  </p>
                  <p className='text-sm text-muted-foreground'>
                    🌸 珍惜这段没有期末压力的时光吧
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
