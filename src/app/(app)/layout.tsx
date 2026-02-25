'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/sidebar';
import { AppHeader } from '@/components/layout/header';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen w-full">
        <div className="hidden md:block">
            <div className="flex h-full w-64 flex-col gap-4 border-r bg-muted/40 p-4">
                <Skeleton className="h-8 w-32" />
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </div>
        </div>
        <div className="flex flex-1 flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
            <Skeleton className="h-8 w-8 md:hidden" />
            <Skeleton className="h-8 w-48" />
          </header>
          <main className="flex-1 p-6">
            <Skeleton className="h-full w-full" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 bg-background p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
