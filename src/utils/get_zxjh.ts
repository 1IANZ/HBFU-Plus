import { invoke } from '@tauri-apps/api/core';

interface ExecutionPlan {
  id: number; // 序号
  semester: string; // 开课学期
  courseCode: string; // 课程编号
  courseName: string; // 课程名称
  department: string; // 开课单位
  credits: number; // 学分
  totalHours: number; // 总学时
  assessmentMethod: string; // 考核方式
  courseType: string; // 课程属性
  isExam: string; // 是否考试
}

function parseExecutionPlan(html: string): ExecutionPlan[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const table =
    doc.querySelector('table#dataList.Nsb_r_list.Nsb_table') ||
    doc.querySelector('table.Nsb_r_list.Nsb_table') ||
    doc.querySelector('table');

  if (!table) {
    console.warn('未找到符合条件的表格元素');
    return [];
  }

  const plans: ExecutionPlan[] = [];
  const rows = Array.from(table.querySelectorAll('tr')).filter(
    (row) => row.cells.length >= 10 && !row.querySelector('th')
  );

  rows.forEach((row, index) => {
    const cells = Array.from(row.cells);
    const getNumber = (text: string | null, fallback = 0): number => {
      const num = Number(text?.trim());
      return isNaN(num) ? fallback : num;
    };

    const plan: ExecutionPlan = {
      id: getNumber(cells[0]?.textContent, index + 1),
      semester: cells[1]?.textContent?.trim() || '',
      courseCode: cells[2]?.textContent?.trim() || '',
      courseName: cells[3]?.textContent?.trim() || '',
      department: cells[4]?.textContent?.trim() || '',
      credits: getNumber(cells[5]?.textContent),
      totalHours: getNumber(cells[6]?.textContent),
      assessmentMethod: cells[7]?.textContent?.trim() || '考查',
      courseType: cells[8]?.textContent?.trim() || '必修',
      isExam: cells[9]?.textContent?.trim() || '',
    };
    plans.push(plan);
  });
  return plans;
}
async function getExecutionPlan(): Promise<ExecutionPlan[]> {
  const htmlContent: string = await invoke('get_zxjh');
  const executionPlan = parseExecutionPlan(htmlContent);
  return executionPlan;
}
export { getExecutionPlan, getSemesterByPlan, type ExecutionPlan };

function parseSemesterByPlan(html: string): string[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const table =
    doc.querySelector('table#dataList.Nsb_r_list.Nsb_table') ||
    doc.querySelector('table.Nsb_r_list.Nsb_table') ||
    doc.querySelector('table');

  if (!table) {
    console.warn('未找到符合条件的表格元素');
    return [];
  }

  const semesters: string[] = [];
  const rows = Array.from(table.querySelectorAll('tr')).filter(
    (row) => row.cells.length >= 10 && !row.querySelector('th')
  );

  for (const row of rows) {
    const cells = Array.from(row.cells);
    const plan: string = cells[1]?.textContent?.trim() || '';

    if (plan && !semesters.includes(plan)) {
      semesters.push(plan);
    }
    if (semesters.length >= 8) {
      break;
    }
  }

  return semesters;
}
async function getSemesterByPlan(): Promise<string[]> {
  const htmlContent: string = await invoke('get_zxjh');
  const executionPlan = parseSemesterByPlan(htmlContent);
  return executionPlan;
}
