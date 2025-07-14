import { invoke } from '@tauri-apps/api/core';

interface ExamSchedule {
  id: number; // 序号
  courseCode: string; // 课程编号
  courseName: string; // 课程名称
  examTime: string; // 考试时间
  examLocation: string; // 考场
}
function parseExamSchedule(htmlString: string): ExamSchedule[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const table = doc.getElementById('dataList');
  if (!table) {
    throw new Error('无法找到考试安排表格');
  }
  const exams: ExamSchedule[] = [];
  const rows = table.querySelectorAll('tr');

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll('td');
    if (cells.length < 9) continue;
    const exam: ExamSchedule = {
      id: parseInt(cells[0].textContent?.trim() || '0'),
      courseCode: cells[2].textContent?.trim() || '',
      courseName: cells[3].textContent?.trim() || '',
      examTime: cells[4].textContent?.trim() || '',
      examLocation: cells[5].textContent?.trim() || '',
    };
    exams.push(exam);
  }
  return exams;
}
async function getExam(semester: string): Promise<ExamSchedule[]> {
  const htmlContent: string = await invoke('get_exam', { semester });
  const exams: ExamSchedule[] = parseExamSchedule(htmlContent);
  return exams;
}
export { getExam, type ExamSchedule };
