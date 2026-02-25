'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';

const getPageTitle = (path: string) => {
    const pathName = path.split('/').pop() || 'dashboard';
    if(pathName === 'new') {
        const parentPath = path.split('/')[1];
        return `New ${parentPath.charAt(0).toUpperCase() + parentPath.slice(1, -1)}`
    }
    return pathName.charAt(0).toUpperCase() + pathName.slice(1);
}

export function AppHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-lg font-semibold md:text-xl">{title}</h1>
    </header>
  );
}
