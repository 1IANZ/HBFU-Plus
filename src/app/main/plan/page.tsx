'use client';

import { useEffect, useState } from 'react';
import { SemesterCombox } from '@/components/Combobox';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import useSemesterByPlan from '@/hooks/useSemesterByPlan';
import usePlan from '@/hooks/usePlan';
import { ExecutionPlan } from '@/utils/get_zxjh';
import { PlanList } from '@/components/main/Plan/PlanList';
export default function Page() {
  const semesters = useSemesterByPlan();
  const [model, setModel] = useState<boolean>(false);
  const [currentSemester, setCurrentSemester] = useState<string>('');
  const plans = usePlan();
  const [planData, setPlanData] = useState<ExecutionPlan[] | null>(null);
  useEffect(() => {
    if (plans && currentSemester) {
      const filteredPlans = plans.filter(
        (plan) => plan.semester === currentSemester
      );
      setPlanData(filteredPlans);
    }

    if (plans && currentSemester === '') {
      setCurrentSemester(plans[0]?.semester || '');
    }
  }, [plans, currentSemester]);

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
          {planData && <PlanList data={planData} model={model} />}
        </div>
      </div>
    </>
  );
}
