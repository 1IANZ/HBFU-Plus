import { invoke } from '@tauri-apps/api/core';

function parseSemester(htmlString: string, isAll: boolean): string[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const rows = doc
    .querySelector('.Nsb_layout_r')
    ?.querySelector('table')
    ?.querySelectorAll('tr');
  const semester = rows?.[0]?.querySelector('td')?.textContent?.trim();
  if (!semester) {
    throw new Error('Unknown semester');
  }

  const semesterList = semester.split('\n\t\t\t\t\t\t').filter((s) => s !== '');
  if (isAll) {
    semesterList.unshift('全部学期');
    return semesterList.slice(0, 11);
  }
  return semesterList.slice(0, 10);
}

export async function getSemester(isAll: boolean): Promise<string[]> {
  const htmlContent: string = await invoke('get_semester');
  const semester: string[] = parseSemester(htmlContent, isAll);
  return semester;
}
