'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  const { theme, setTheme } = useTheme();

  return (
<header className="sticky top-0 z-50 flex h-18 items-center justify-between gap-4 px-6 py-4">
  <div className="flex items-center gap-4">
    <SidebarTrigger className="md:hidden" />

    {/* Title with separate rounded background */}
    <div className="rounded-2xl bg-card/60 backdrop-blur-md border border-white/10 px-5 py-2 shadow-lg">
      <h1 className="text-2xl font-semibold tracking-tight">
        {title}
      </h1>
    </div>
  </div>

  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      {/* Theme toggle with its own rounded background */}
      <Button
        variant="ghost"
        size="icon"
        className="rounded-2xl bg-card/60 backdrop-blur-md border border-white/10 shadow-lg hover:bg-card/80 transition-all duration-300"
      >
        {theme === 'dark' ? (
          <Moon className="h-5 w-5" />
        ) : theme === 'light' ? (
          <Sun className="h-5 w-5" />
        ) : (
          <Monitor className="h-5 w-5" />
        )}
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="end"
      className="rounded-2xl border border-white/10 bg-card/95 p-2 shadow-2xl shadow-black/30 backdrop-blur-xl"
    >
      <DropdownMenuItem
        onClick={() => setTheme('light')}
        className="cursor-pointer rounded-xl px-4 py-3 transition-colors hover:bg-white/10"
      >
        <Sun className="h-4 w-4 mr-2" />
        Light
      </DropdownMenuItem>

      <DropdownMenuItem
        onClick={() => setTheme('dark')}
        className="cursor-pointer rounded-xl px-4 py-3 transition-colors hover:bg-white/10"
      >
        <Moon className="h-4 w-4 mr-2" />
        Dark
      </DropdownMenuItem>

      <DropdownMenuItem
        onClick={() => setTheme('system')}
        className="cursor-pointer rounded-xl px-4 py-3 transition-colors hover:bg-white/10"
      >
        <Monitor className="h-4 w-4 mr-2" />
        System
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</header>
  );
}
