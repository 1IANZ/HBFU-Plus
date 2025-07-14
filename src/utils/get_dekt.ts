import { invoke } from '@tauri-apps/api/core';
let DEKTHTML: string = '';

interface DEKT {
  id: string; // 序号
  semester: string; // 学年学期
  category: string; // 学分类别
  subCategory: string; // 学分子类
  activityName: string; // 活动名称
  credit: string; // 所得学分
  operationId: string;
}
function ParseDEKT(htmlContent: string): DEKT[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const table = doc.getElementById('dataList');
  if (!table) {
    return [];
  }
  const rows = Array.from(table.querySelectorAll('tr')).slice(1);
  const dekts: DEKT[] = [];
  rows.forEach((row) => {
    const cells = Array.from(row.cells);
    const link = cells[6].querySelector('a');
    const onclickText = link?.getAttribute('onclick');
    const idMatch = onclickText?.match(/cxxf07id=([^&]+)/);
    const operationId: string = idMatch ? idMatch[1] : '';
    const dekt: DEKT = {
      id: cells[0].textContent?.trim() || '',
      semester: cells[1].textContent?.trim() || '',
      category: cells[2].textContent?.trim() || '',
      subCategory: cells[3].textContent?.trim() || '',
      activityName: cells[4].textContent?.trim() || '',
      credit: cells[5].textContent?.trim() || '',
      operationId,
    };

    dekts.push(dekt);
  });
  return dekts;
}

async function getDEKT(): Promise<DEKT[]> {
  DEKTHTML = await invoke('get_dekt');
  const dekts = ParseDEKT(DEKTHTML);
  return dekts;
}

type DEKTDetail = Record<string, string>;

function ParseDEKTDetail(htmlContent: string): DEKTDetail {
  const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
  const table = doc.querySelector('table.dataTable');
  const result: DEKTDetail = {};

  if (!table) return result;

  const rows = table.querySelectorAll('tr');

  rows.forEach((row) => {
    const cells = row.querySelectorAll('td');
    for (let i = 0; i < cells.length; i += 2) {
      const labelCell = cells[i];
      const valueCell = cells[i + 1];
      if (!labelCell || !valueCell) continue;
      const label = labelCell.textContent?.trim().replace(':', '');
      const input = valueCell.querySelector('input');
      const value = input?.getAttribute('value')?.trim();
      if (label && value) {
        result[label] = value;
      }
    }
  });

  return result;
}

async function getDEKTDetail(operationId: string): Promise<DEKTDetail> {
  const htmlContent: string = await invoke('get_dekt_detail', { operationId });
  return ParseDEKTDetail(htmlContent);
}

interface DEKTTotal {
  totalCredit: string;
  category: string;
}
function ParseDEKTTotal(htmlContent: string): DEKTTotal[] {
  const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
  const tables = doc.querySelectorAll('table.Nsb_r_list');
  const table = tables[0];
  if (!table) return [];
  const result: DEKTTotal[] = [];
  const rows = Array.from(table.querySelectorAll('tr')).slice(1);
  rows.forEach((row) => {
    const cells = Array.from(row.querySelectorAll('td'));
    result.push({
      totalCredit: cells[0].textContent?.trim() || '',
      category: cells[1].textContent?.trim() || '',
    });
  });

  return result;
}

async function getDEKTTotal(): Promise<DEKTTotal[]> {
  if (!DEKTHTML) {
    DEKTHTML = await invoke('get_dekt');
  }
  return ParseDEKTTotal(DEKTHTML);
}

export {
  getDEKT,
  getDEKTDetail,
  getDEKTTotal,
  type DEKT,
  type DEKTDetail,
  type DEKTTotal,
};
