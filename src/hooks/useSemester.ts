import { useEffect, useState } from 'react';
import { getSemester } from '../utils/get_semester';

export default function useSemester(isAll: boolean) {
  const [semester, setSemester] = useState<string[] | null>(null);
  useEffect(() => {
    async function fetchSemester() {
      const semester = await getSemester(isAll);
      setSemester(semester);
    }
    fetchSemester();
  }, []);
  return semester;
}
