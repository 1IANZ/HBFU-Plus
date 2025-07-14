'use client';
import { SemesterCombox } from '@/components/Combobox';
import { CreditTable } from '@/components/main/Credit/CreditTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useSemester from '@/hooks/useSemester';
import { CreditInfo, getCreditInfo } from '@/utils/get_xqxkch';
import { useEffect, useState } from 'react';

export default function Page() {
  const semesters = useSemester(false);
  const [creditData, setCreditData] = useState<CreditInfo[]>([]);
  const [currentSemester, setCurrentSemester] = useState<string>('');

  const fetchCredit = async (semester: string) => {
    const credits = await getCreditInfo(semester);
    setCreditData(credits);
  };
  useEffect(() => {
    if (semesters && currentSemester === '') {
      setCurrentSemester(semesters[1]);
    }
  }, [semesters]);

  useEffect(() => {
    if (currentSemester) {
      fetchCredit(currentSemester);
    }
  }, [currentSemester]);

  return (
    <>
      <div className='flex gap-2 w-[calc(100vw-140px)] px-8 overflow-y-auto'>
        <SemesterCombox
          data={semesters || []}
          value={currentSemester}
          onChange={(value: string) => setCurrentSemester(value)}
        />
      </div>
      <div className='h-[calc(100vh-100px)] overflow-y-auto mx-auto px-8 py-4'>
        <CreditTable data={creditData} />
      </div>
    </>
  );
}
