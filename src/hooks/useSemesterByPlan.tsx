import { useEffect, useState } from 'react';
import { getSemesterByPlan } from '../utils/get_zxjh';

export default function useSemesterByPlan() {
  const [semesters, setSemesters] = useState<string[] | null>(null);
  useEffect(() => {
    async function fetchSemesters() {
      const semesters = await getSemesterByPlan();
      setSemesters(semesters);
    }
    fetchSemesters();
  }, []);
  return semesters;
}
