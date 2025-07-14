import { invoke } from '@tauri-apps/api/core';

export interface StudentInfo {
  name: string; // 姓名
  gender: string; // 性别
  studentId: string; // 学号
  department: string; // 院系
  major: string; // 专业
  className: string; // 班级
  admissionDate: string; // 入学日期
  admissionNumber: string; // 入学学号
  idNumber: string; // 身份证号
}

function parseStudentInfo(htmlString: string): StudentInfo {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const table = doc.getElementById('xjkpTable');
  if (!table) {
    throw new Error('无法找到学籍信息表格');
  }
  const rows = table.querySelectorAll('tr');
  const getText = (element: Element | null, selector?: string): string => {
    const target = selector ? element?.querySelector(selector) : element;
    return target?.textContent?.trim().replace(/&nbsp;/g, ' ') || '';
  };
  const infoRow = rows[2];
  const infoCells = Array.from(infoRow.querySelectorAll('td'));
  const personalRow = rows[3];
  const personalCells = Array.from(personalRow.querySelectorAll('td'));
  const admissionDateRow = rows[46];
  const admissionDateCells = Array.from(
    admissionDateRow.querySelectorAll('td')
  );
  const idNumberRow = rows[47];
  const idNumberCells = Array.from(idNumberRow.querySelectorAll('td'));

  return {
    name: getText(personalCells[1]),
    gender: getText(personalCells[3]),
    studentId: getText(infoCells[4]).replace('学号：', ''),
    department: getText(infoCells[0]).replace('院系：', ''),
    major: getText(infoCells[1]).replace('专业：', ''),
    className: getText(infoCells[3]).replace('班级：', ''),
    admissionDate: getText(admissionDateCells[1]).replace('&nbsp', ''),
    admissionNumber: getText(idNumberCells[1]).replace('&nbsp;', ''),
    idNumber: getText(idNumberCells[3]).replace('&nbsp;', ''),
  };
}
export async function getStudentInfo(): Promise<StudentInfo> {
  const htmlContent: string = await invoke('get_xsxx');
  const studentInfo = parseStudentInfo(htmlContent);
  return studentInfo;
}
