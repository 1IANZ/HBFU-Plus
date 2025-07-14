'use client';

import { SemesterCombox } from '@/components/Combobox';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Score } from '@/utils/get_score';
import { getScore } from '@/utils/get_score';
import { ScoreList } from '@/components/main/Score/ScoreList';
import { toast } from 'sonner';
import useSemester from '@/hooks/useSemester';

export default function Page() {
  const semesters = useSemester(true);
  const [model, setModel] = useState<boolean>(false);
  const [scoreData, setScoreData] = useState<Score | null>(null);
  const [currentSemester, setCurrentSemester] = useState<string>('');

  async function fetchScore(semester: string) {
    const s = await getScore(semester);
    setScoreData(s);
  }

  useEffect(() => {
    if (semesters && currentSemester === '') {
      setCurrentSemester(semesters[2]);
    }
  }, [semesters]);

  useEffect(() => {
    if (currentSemester) {
      fetchScore(currentSemester === '全部学期' ? '' : currentSemester);
    }
  }, [currentSemester]);

  return (
    <>
      <div className='flex gap-2  w-[calc(100vw-140px)] px-8  '>
        <SemesterCombox
          data={semesters || []}
          value={currentSemester}
          onChange={(value: string) => setCurrentSemester(value)}
        />

        <Button
          onClick={() => {
            fetchScore(currentSemester === '全部学期' ? '' : currentSemester);
            toast('刷新成功');
          }}
        >
          刷新
        </Button>
        <div className='flex items-center space-x-2 justify-end w-full'>
          <Switch id='model' checked={model} onCheckedChange={setModel} />
          <Label htmlFor='model'>{model ? '列表' : '卡片'}</Label>
        </div>
      </div>
      <div className='h-[calc(100vh-100px)] overflow-y-auto'>
        <div className='mx-auto px-4'>
          {scoreData && <ScoreList data={scoreData} model={model} />}
        </div>
      </div>
    </>
  );
}
