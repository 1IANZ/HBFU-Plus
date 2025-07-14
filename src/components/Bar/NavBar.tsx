'use client';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';

export default function Navbar({
  data,
}: {
  data: { title: string; href: string; icon: any }[];
}) {
  return (
    <NavigationMenu className='flex flex-col w-48 border-r p-4 h-[calc(100vh-3rem)]'>
      <NavigationMenuList className='flex flex-col space-y-2 '>
        {data.map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink asChild>
              <Link href={item.href}>
                <item.icon />
                {item.title}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
