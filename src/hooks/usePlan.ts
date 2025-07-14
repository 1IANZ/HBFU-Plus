import { useEffect, useState } from 'react';
import { getExecutionPlan, ExecutionPlan } from '../utils/get_zxjh';

export default function usePlan() {
  const [plans, setPlans] = useState<ExecutionPlan[] | null>(null);
  useEffect(() => {
    async function fetchPlans() {
      const plans = await getExecutionPlan();
      setPlans(plans);
    }
    fetchPlans();
  }, []);
  return plans;
}
