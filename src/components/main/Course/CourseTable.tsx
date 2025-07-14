'use client';

import React, { useState, useEffect } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { CourseSchedule } from '@/utils/get_xskb';
import { PopoverClose } from '@radix-ui/react-popover';

const days = [
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
  '星期日',
];
const sections = Array.from({ length: 8 }, (_, i) => i + 1);

type MergedCourse = {
  course: CourseSchedule;
  startSection: number;
  span: number;
};

export interface CourseTableProps {
  courses: CourseSchedule[];
}

export default function CourseTable({ courses }: CourseTableProps) {
  const [mergedCourses, setMergedCourses] = useState<
    Record<string, MergedCourse[]>
  >({});
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  useEffect(() => {
    setMergedCourses(mergeCourses(courses));
  }, [courses]);

  const mergeCourses = (courses: CourseSchedule[]) => {
    const map: Record<string, MergedCourse[]> = {};
    days.forEach((day) => {
      const dayCourses = courses
        .filter((c) => c.dayOfWeek === day)
        .sort((a, b) => a.section - b.section);

      const mergedList: MergedCourse[] = [];
      let i = 0;
      while (i < dayCourses.length) {
        const base = dayCourses[i];
        let span = 1;
        let j = i + 1;
        while (
          j < dayCourses.length &&
          dayCourses[j].name === base.name &&
          dayCourses[j].section === dayCourses[j - 1].section + 1
        ) {
          span++;
          j++;
        }
        mergedList.push({ course: base, startSection: base.section, span });
        i = j;
      }
      map[day] = mergedList;
    });
    return map;
  };
  const courseBg = 'bg-blue-600 dark:bg-blue-800';
  const courseText = 'text-white';

  return (
    <div className='flex flex-col h-full px-4 py-4'>
      <div className='flex-1 overflow-auto min-h-0  [scrollbar-gutter:stable] w-full border border-gray-300 dark:border-gray-700 rounded-md'>
        <div
          className='inline-grid w-full'
          style={{
            gridTemplateColumns: '80px repeat(7, minmax(0, 1fr))',
            gridTemplateRows: '40px repeat(8, 100px)',
          }}
        >
          <div className='border-r border-b border-gray-300 dark:border-gray-700 flex items-center justify-center font-semibold text-sm select-none'>
            节次 / 星期
          </div>

          {days.map((day, idx) => (
            <div
              key={day}
              className={`border-b border-r border-gray-300 dark:border-gray-700 flex items-center justify-center font-semibold text-sm select-none ${
                idx === days.length - 1 ? '' : 'border-r'
              }`}
            >
              {day}
            </div>
          ))}

          {sections.map((section, idx) => (
            <div
              key={`section-${section}`}
              className={`border-r border-b border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center text-xs select-none px-1 ${
                idx === sections.length - 1 ? '' : 'border-b'
              }`}
              style={{ gridColumn: 1, gridRow: idx + 2 }}
            >
              <div>第{section}大节</div>
              <div className='text-gray-500 dark:text-gray-400 leading-tight text-center whitespace-pre-wrap'>
                {(courses.find((c) => c.section === section)?.timeRange || '')
                  .split('-')
                  .join('\n')}
              </div>
            </div>
          ))}

          {days.map((day, colIdx) => {
            const mergedList = mergedCourses[day] || [];
            const occupiedSections = new Set<number>();

            return (
              <React.Fragment key={`day-col-${day}`}>
                {sections.map((section, rowIdx) => {
                  if (occupiedSections.has(section)) return null;

                  const merged = mergedList.find(
                    (m) => m.startSection === section
                  );

                  if (merged) {
                    for (
                      let s = merged.startSection;
                      s < merged.startSection + merged.span;
                      s++
                    ) {
                      occupiedSections.add(s);
                    }
                    const course = merged.course;

                    return (
                      <Popover
                        key={`${day}-${section}`}
                        open={selectedCourseId === course.id}
                        onOpenChange={(open) => {
                          if (open) setSelectedCourseId(course.id);
                          else setSelectedCourseId(null);
                        }}
                      >
                        <PopoverTrigger asChild>
                          <div
                            className={`${courseBg} ${courseText} cursor-pointer p-2  shadow-md select-none
                              flex flex-col justify-center items-center
                              text-xs
                              overflow-hidden
                              whitespace-normal
                              text-center
                              hover:shadow-lg
                              transition-shadow duration-200
                            `}
                            style={{
                              gridColumn: colIdx + 2,
                              gridRow: `${rowIdx + 2} / span ${merged.span}`,
                            }}
                          >
                            <div className='font-semibold line-clamp-2'>
                              {course.name}
                            </div>
                            <div className='text-[10px] opacity-80'>
                              {course.classroom}
                            </div>
                            <div className='text-[9px] opacity-60'>
                              {course.weeks}
                            </div>
                          </div>
                        </PopoverTrigger>

                        <PopoverContent
                          align='center'
                          side='top'
                          sideOffset={6}
                          className='w-64 p-4 rounded-md shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700'
                        >
                          <div className='flex justify-between items-center mb-2'>
                            <h3 className='font-semibold text-lg'>
                              {course.name}
                            </h3>
                            <PopoverClose className='cursor-pointer' />
                          </div>
                          <div className='text-sm text-gray-700 dark:text-gray-300 space-y-1'>
                            <div>
                              <span className='font-semibold'>教师: </span>
                              {course.teacher || '无'}
                            </div>
                            <div>
                              <span className='font-semibold'>教室: </span>
                              {course.classroom || '无'}
                            </div>
                            <div>
                              <span className='font-semibold'>节次: </span>
                              {course.duration || '无'}
                            </div>
                            <div>
                              <span className='font-semibold'>时间: </span>
                              {course.timeRange || '无'}
                            </div>
                            <div>
                              <span className='font-semibold'>周次: </span>
                              {course.weeks || '无'}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    );
                  } else {
                    return (
                      <div
                        key={`${day}-${section}`}
                        className='border-r border-b border-gray-300 dark:border-gray-700'
                        style={{
                          gridColumn: colIdx + 2,
                          gridRow: rowIdx + 2,
                        }}
                      />
                    );
                  }
                })}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
