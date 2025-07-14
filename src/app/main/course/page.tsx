'use client';

import { SemesterCombox } from '@/components/Combobox';
import CourseTable from '@/components/main/Course/CourseTable';
import useSemester from '@/hooks/useSemester';
import { useEffect, useState } from 'react';
import { CourseSchedule, downloadXskb, getXskb } from '@/utils/get_xskb';
import { Button } from '@/components/ui/button';

export default function Page() {
  const semesters = useSemester(false);
  const [currentSemester, setCurrentSemester] = useState<string>('');
  const [courses, setCourses] = useState<CourseSchedule[]>([]);

  useEffect(() => {
    if (semesters && currentSemester === '') {
      setCurrentSemester(semesters[0]);
    }
  }, [semesters]);

  useEffect(() => {
    if (!currentSemester) return;
    async function fetchCourses() {
      const data = await getXskb(currentSemester);
      setCourses(data);
    }
    fetchCourses();
  }, [currentSemester]);

  async function handleDownload() {
    const result = await downloadXskb(currentSemester);
    console.log(result);
  }
  return (
    <>
      <div className='flex gap-2  w-[calc(100vw-140px)] px-8  '>
        <SemesterCombox
          data={semesters || []}
          value={currentSemester}
          onChange={(value: string) => setCurrentSemester(value)}
        />

        <div className='flex items-center space-x-2 justify-end w-full'>
          <Button onClick={handleDownload}>导出Excel</Button>
        </div>
      </div>
      <div className='h-[calc(100vh-125px)] overflow-y-auto'>
        <div className='mx-auto px-4'>
          <CourseTable courses={courses} />
        </div>
      </div>
    </>
  );
}
