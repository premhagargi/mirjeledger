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
            <div className="flex h-full w-64 flex-col gap-4 border-r border-border/30 bg-card p-4">
                <Skeleton className="h-10 w-32" />
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-12 w-full rounded-xl" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                    <Skeleton className="h-12 w-full rounded-xl" />
                </div>
            </div>
        </div>
        <div className="flex flex-1 flex-col">
          <header className="flex h-16 items-center justify-between border-b border-border/30 bg-card/50 px-6 backdrop-blur-sm">
            <Skeleton className="h-6 w-6 md:hidden" />
            <Skeleton className="h-6 w-48" />
          </header>
          <main className="flex-1 p-6 md:p-8">
            <Skeleton className="h-full w-full rounded-3xl" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-border/30">
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <AppHeader />
        <main className="flex-1 bg-background p-6 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
