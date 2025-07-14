'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import useStudentInfo from '@/hooks/useInfo';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useState } from 'react';

export default function Page() {
  const info = useStudentInfo();
  const [isView, setIsView] = useState<boolean>(false);

  return (
    <div className='px-9 py-3'>
      <Card className='justify-center w-[calc(100vw-200px)] h-[calc(100vh-100px)] '>
        <CardHeader>
          <CardTitle className='text-center text-2xl font-bold'>
            个人信息
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block mb-1 text-sm font-medium'>姓名</label>
              <Input value={info?.name || ''} readOnly />
            </div>
            <div>
              <label className='block mb-1 text-sm font-medium'>性别</label>
              <Input value={info?.gender || ''} readOnly />
            </div>
            <div>
              <label className='block mb-1 text-sm font-medium'>专业</label>
              <Input value={info?.major || ''} readOnly />
            </div>

            <div>
              <label className='block mb-1 text-sm font-medium'>学号</label>
              <Input value={info?.studentId || ''} readOnly />
            </div>
            <div>
              <label className='block mb-1 text-sm font-medium'>院系</label>
              <Input value={info?.department || ''} readOnly />
            </div>

            <div>
              <label className='block mb-1 text-sm font-medium'>入学日期</label>
              <Input value={info?.admissionDate || ''} readOnly />
            </div>
            <div>
              <label className='block mb-1 text-sm font-medium'>班级</label>
              <Input value={info?.className || ''} readOnly />
            </div>
            <div>
              <label className='block mb-1 text-sm font-medium'>入学学号</label>
              <Input value={info?.admissionNumber || ''} readOnly />
            </div>
            <div className='col-span-2'>
              <label className='block mb-1 text-sm font-medium'>身份证号</label>
              <div className='relative'>
                <Input
                  type={isView ? 'text' : 'password'}
                  value={info?.idNumber || ''}
                  readOnly
                  className='pr-10'
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='absolute right-0 top-1/2 -translate-y-1/2'
                  onClick={() => setIsView(!isView)}
                >
                  {isView ? <EyeIcon /> : <EyeOffIcon />}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
