import { invoke } from '@tauri-apps/api/core';

interface XqxkchInfo {
  course_id: string; // 课程号
  course_name: string; // 课程名称
  department: string; // 开课单位
  hours: number; // 学时
  credits: number; // 学分
  course_attribute: string; // 课程属性
  selection_type: string; // 选课类型
  selected: string; // 选中状态
}

interface CreditInfo {
  category: string; // 分类
  required: number; // 必修
  limited: number; // 限选
  elective: number; // 任选
  public: number; // 公选
  total: number; // 总学分
}
function parseCreditInfo(htmlString: string): CreditInfo[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const creditData: CreditInfo[] = [];

  const tables = doc.querySelectorAll('table.Nsb_r_list.Nsb_table');

  if (!tables) {
    throw new Error('无法找到学分信息表格');
  }
  const table = tables[0];

  const rows = Array.from(table.querySelectorAll('tr')).filter(
    (row) => !row.querySelector('th')
  );

  for (const row of rows) {
    const cells = Array.from(row.querySelectorAll('td'));
    if (cells.length >= 6) {
      creditData.push({
        category: cells[0].textContent?.trim() || '',
        required: parseInt(cells[1].textContent?.trim() || '0') || 0,
        limited: parseInt(cells[2].textContent?.trim() || '0') || 0,
        elective: parseInt(cells[3].textContent?.trim() || '0') || 0,
        public: parseInt(cells[4].textContent?.trim() || '0') || 0,
        total: parseInt(cells[5].textContent?.trim() || '0') || 0,
      });
    }
  }

  return creditData;
}

function parseXqxkchInfo(htmlString: string): XqxkchInfo[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const courses: XqxkchInfo[] = [];

  const tables = doc.querySelectorAll('table.Nsb_r_list.Nsb_table');
  if (!tables) {
    throw new Error('无法找到课程信息表格');
  }
  const table = tables[1];

  const rows = Array.from(table.querySelectorAll('tr')).filter(
    (row) => !row.querySelector('th')
  );

  for (const row of rows) {
    const cells = Array.from(row.querySelectorAll('td'));
    if (cells.length >= 8) {
      courses.push({
        course_id: cells[0].textContent?.trim() || '',
        course_name: cells[1].textContent?.trim() || '',
        department: cells[2].textContent?.trim() || '',
        hours: parseInt(cells[3].textContent?.trim() || '0') || 0,
        credits: parseFloat(cells[4].textContent?.trim() || '0') || 0,
        course_attribute: cells[5].textContent?.trim() || '',
        selection_type: cells[6].textContent?.trim() || '',
        selected: cells[7].textContent?.trim() || '',
      });
    }
  }

  return courses;
}
async function getXqxkch(semester: string): Promise<XqxkchInfo[]> {
  const htmlContent: string = await invoke('get_xqxkch', { semester });
  const courses = parseXqxkchInfo(htmlContent);
  return courses;
}
async function getCreditInfo(semester: string): Promise<CreditInfo[]> {
  const htmlContent: string = await invoke('get_xqxkch', { semester });
  const courses = parseCreditInfo(htmlContent);
  return courses;
}
export { getXqxkch, getCreditInfo, type XqxkchInfo, type CreditInfo };
