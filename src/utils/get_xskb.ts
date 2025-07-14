import { invoke } from '@tauri-apps/api/core';
interface CourseSchedule {
  id: string; // 格式："星期几-节次-课程名"（如"4-1-大学语文"）
  name: string; // 课程名称
  teacher: string; // 教师
  timeRange: string; // 时间范围（如"08:00~09:30"）
  dayOfWeek: string; // 星期几（文字："星期一"~"星期日"）
  section: number; // 节次（数字：1~8）
  weeks: string; // 周次（如"4-17周"）
  classroom: string; // 教室
  duration: string; // 持续节次（如"01-02节"）
}
function parseCourseSchedule(html: string): CourseSchedule[] {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const courses: CourseSchedule[] = [];
  const table = doc.getElementById('kbtable');
  if (!table) return courses;

  const WEEK_DAYS = [
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
    '星期日',
  ];
  const SECTION_NAMES = ['一', '二', '三', '四', '五', '六', '七', '八'];

  Array.from(table.querySelectorAll('tr'))
    .slice(1)
    .forEach((row) => {
      const sectionTh = row.querySelector('th');
      if (!sectionTh) return;

      const sectionText = sectionTh.textContent?.trim() || '';
      const sectionNum =
        SECTION_NAMES.findIndex((cn) => sectionText.includes(`第${cn}大节`)) +
        1;
      if (sectionNum === 0) return;

      const timeRange = extractTimeRanges(sectionText);

      Array.from(row.querySelectorAll('td'))
        .slice(0, 7)
        .forEach((cell, dayIndex) => {
          const courseDiv = cell.querySelector('.kbcontent1');
          if (!courseDiv?.textContent?.trim()) return;

          const courseName = courseDiv.innerHTML.split('<br>')[0].trim();
          const weeks = extractText(courseDiv, 'font[title*="周次"]').replace(
            /\(周\)/g,
            '周'
          );
          const classroom = extractText(courseDiv, 'font[title*="教室"]');

          const detailDiv = cell.querySelector('.kbcontent');
          const teacher = extractText(detailDiv, 'font[title*="老师"]');
          const duration = extractDuration(detailDiv);

          courses.push({
            id: `${dayIndex + 1}-${sectionNum}-${courseName}`,
            name: courseName,
            teacher: teacher || '未提供',
            timeRange: timeRange,
            dayOfWeek: WEEK_DAYS[dayIndex],
            section: sectionNum,
            weeks: weeks,
            classroom: classroom,
            duration: duration || '未提供',
          });
        });
    });

  return courses;
}

function extractDuration(el: Element | null): string {
  const text = el?.innerHTML || '';
  const match = text.match(/\[((?:\d{2}-?)+)\]节?/);
  return match ? `${match[1]}节` : '';
}

function extractText(el: Element | null, selector: string): string {
  return el?.querySelector(selector)?.textContent?.trim() || '';
}

async function getXskb(semester: string): Promise<CourseSchedule[]> {
  const htmlString: string = await invoke('get_xskb', { semester });
  const courseJson = parseCourseSchedule(htmlString);
  return courseJson;
}
function extractTimeRanges(sectionText: string): string {
  const matches = sectionText.match(/\d{2}:\d{2}~\d{2}:\d{2}/g);
  if (!matches) return '';
  return matches.join('-');
}

async function downloadXskb(semester: string): Promise<string> {
  const res: string = await invoke('download_xskb', { semester });
  return res;
}
export { getXskb, downloadXskb, type CourseSchedule };
