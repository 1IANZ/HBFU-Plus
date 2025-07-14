'use client';
import NavBar from '@/components/Bar/NavBar';
import {
  BookOpenIcon,
  UserIcon,
  BookOpenCheckIcon,
  NavigationIcon,
  BookIcon,
  LandPlotIcon,
  LibraryIcon,
  GraduationCap,
  LinkIcon,
} from 'lucide-react';
export default function Layout({ children }: { children: React.ReactNode }) {
  const NavInfo = [
    {
      title: '个人信息',
      href: '/main/info',
      icon: UserIcon,
    },
    {
      title: '课程信息',
      href: '/main/course',
      icon: BookOpenIcon,
    },
    {
      title: '成绩信息',
      href: '/main/score',
      icon: BookOpenCheckIcon,
    },
    {
      title: '考试安排',
      href: '/main/exam',
      icon: NavigationIcon,
    },
    {
      title: '选课信息',
      href: '/main/select',
      icon: BookIcon,
    },
    {
      title: '执行计划',
      href: '/main/plan',
      icon: LandPlotIcon,
    },
    {
      title: '学分信息',
      href: '/main/credit',
      icon: LibraryIcon,
    },
    {
      title: '第二课堂',
      href: '/main/dekt',
      icon: GraduationCap,
    },
    {
      title: 'ALEXNIAN',
      href: '/main/alex',
      icon: LinkIcon,
    },
  ];

  return (
    <>
      <div className='fixed top-12 left-0 z-50 '>
        <NavBar data={NavInfo} />
      </div>
      <div className='ml-32 pt-16'>{children}</div>
    </>
  );
}
