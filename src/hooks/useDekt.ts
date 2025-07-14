import { useEffect, useState } from 'react';
import {
  getDEKT,
  DEKT,
  DEKTDetail,
  getDEKTDetail,
  getDEKTTotal,
  DEKTTotal,
} from '../utils/get_dekt';

export function useDekt() {
  const [dekts, setDekts] = useState<DEKT[] | null>(null);
  useEffect(() => {
    async function fetchDekt() {
      const dekts = await getDEKT();
      setDekts(dekts);
    }
    fetchDekt();
  }, []);
  return dekts;
}
export function useDektTotal() {
  const [total, setTotal] = useState<DEKTTotal[] | null>(null);
  useEffect(() => {
    async function fetchTotal() {
      const total = await getDEKTTotal();
      setTotal(total);
    }
    fetchTotal();
  }, []);
  return total;
}
export function useDektDetail(operationId: string) {
  const [detail, setDetail] = useState<DEKTDetail | null>(null);
  useEffect(() => {
    async function fetchDetail() {
      const detail = await getDEKTDetail(operationId);
      setDetail(detail);
    }
    fetchDetail();
  }, []);
  return detail;
}
