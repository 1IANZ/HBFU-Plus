import { useEffect, useState } from 'react';
import { getStudentInfo, StudentInfo } from '../utils/get_info';

export default function useStudentInfo() {
  const [info, setInfo] = useState<StudentInfo | null>(null);
  useEffect(() => {
    async function fetchInfo() {
      const info = await getStudentInfo();
      setInfo(info);
    }
    fetchInfo();
  }, []);
  return info;
}
