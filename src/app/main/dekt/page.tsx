'use client';

import { useDekt, useDektTotal } from '@/hooks/useDekt';
import { DEKTList } from '@/components/main/Dekt/DektList';

export default function Page() {
  const dekt = useDekt();
  const dektTotal = useDektTotal();
  return (
    <div className='w-[calc(100vw-130px)] mx-auto px-4'>
      {dekt && <DEKTList data={dekt || []} totals={dektTotal || []} />}
    </div>
  );
}
