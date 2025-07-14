import { invoke } from '@tauri-apps/api/core';

interface ScoreInfo {
  id: number; // ID
  term: string; // 学期
  courseId: string; // 课程ID
  courseName: string; // 课程名称
  score: number; // 成绩
  credit: number; // 学分
  hours: number; // 学时
  gpa: number; // 绩点
  examType: string; // 考试类型
  courseAttr: string; // 课程属性
  courseNature: string; // 课程性质
}
interface ScoreSummary {
  creditTotal: number; // 学分总和
  gpaAverage: number; // 平均绩点
}

interface Score {
  info: ScoreInfo[];
  summary: ScoreSummary;
}

function parseScoreSummary(htmlString: string): ScoreSummary {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const rows = doc.querySelectorAll('table[style*="text-align: center"] tr');
  const summaryRow = rows[0];
  const tds = summaryRow.querySelectorAll('td');
  const creditText = tds[5].textContent?.trim() ?? '';
  const gpaText = tds[7].textContent?.trim() ?? '';
  const creditTotal = Number(creditText);
  const gpaAverage = Number(gpaText);
  return {
    creditTotal,
    gpaAverage,
  };
}

function parseScore(htmlString: string): ScoreInfo[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const table = doc.getElementById('dataList');
  if (!table) {
    throw new Error('无法找到成绩表格');
  }
  const grades: ScoreInfo[] = [];
  const rows = table.querySelectorAll('tr');
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll('td');
    if (cells.length < 11) continue;
    const grade: ScoreInfo = {
      id: parseInt(cells[0].textContent?.trim() || '0'),
      term: cells[1].textContent?.trim() || '',
      courseId: cells[2].textContent?.trim() || '',
      courseName: cells[3].textContent?.trim() || '',
      score: parseFloat(cells[4].textContent?.trim() || '0'),
      credit: parseFloat(cells[5].textContent?.trim() || '0'),
      hours: parseFloat(cells[6].textContent?.trim() || '0'),
      gpa: parseFloat(cells[7].textContent?.trim() || '0'),
      examType: cells[8].textContent?.trim() || '',
      courseAttr: cells[9].textContent?.trim() || '',
      courseNature: cells[10].textContent?.trim() || '',
    };
    grades.push(grade);
  }
  return grades;
}
async function getScore(semester: string): Promise<Score> {
  const htmlContent: string = await invoke('get_score', { semester });
  const info = parseScore(htmlContent);
  const summary = parseScoreSummary(htmlContent);
  const grade: Score = {
    info,
    summary,
  };
  return grade;
}
export { getScore, type Score, type ScoreInfo, type ScoreSummary };
