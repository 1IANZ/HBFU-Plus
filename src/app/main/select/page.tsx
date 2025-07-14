'use client';
import { SemesterCombox } from '@/components/Combobox';
import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import useSemester from '@/hooks/useSemester';
import { XqxkList } from '@/components/main/Xqxk/xqxkList';
import { XqxkchInfo, getXqxkch } from '@/utils/get_xqxkch';

export default function Page() {
  const semesters = useSemester(false);
  const [model, setModel] = useState<boolean>(false);
  const [xqxkData, setxqxkData] = useState<XqxkchInfo[] | null>(null);
  const [currentSemester, setCurrentSemester] = useState<string>('');

  async function fetchxqxk(semester: string) {
    const s = await getXqxkch(semester);
    setxqxkData(s);
  }

  useEffect(() => {
    if (semesters && currentSemester === '') {
      setCurrentSemester(semesters[0]);
    }
  }, [semesters]);

  useEffect(() => {
    if (currentSemester) {
      fetchxqxk(currentSemester);
    }
  }, [currentSemester]);

  return (
    <>
      <div className='flex gap-2 w-[calc(100vw-140px)] px-8'>
        <SemesterCombox
          data={semesters || []}
          value={currentSemester}
          onChange={(value) => setCurrentSemester(value)}
        />

        <div className='flex items-center space-x-2 justify-end w-full'>
          <Switch id='model' checked={model} onCheckedChange={setModel} />
          <Label htmlFor='model'>{model ? '列表' : '卡片'}</Label>
        </div>
      </div>

      <div className='h-[calc(100vh-100px)] overflow-y-auto'>
        <div className='mx-auto px-4'>
          {xqxkData && <XqxkList data={xqxkData} model={model} />}
        </div>
      </div>
    </>
  );
}
