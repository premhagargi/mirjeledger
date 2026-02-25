'use client';

import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Boxes,
  Users,
  ShoppingCart,
  DollarSign,
  LogOut,
  BrainCircuit,
  Coffee
} from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/stock', label: 'Stock', icon: Boxes },
  { href: '/agents', label: 'Agents', icon: Users },
  { href: '/purchases', label: 'Purchases', icon: ShoppingCart },
  { href: '/sales', label: 'Sales', icon: DollarSign },
  { href: '/analysis', label: 'AI Analysis', icon: BrainCircuit },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const logo = PlaceHolderImages.find((img) => img.id === 'logo');

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-2">
            {logo ? (
              <Image
                src={logo.imageUrl}
                alt={logo.description}
                width={36}
                height={36}
                data-ai-hint={logo.imageHint}
                className="rounded-xl"
              />
            ) : (
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <Coffee className="h-5 w-5 text-primary" />
              </div>
            )}
            <h2 className="text-lg font-bold text-white group-data-[collapsible=icon]:hidden">
                Mirje Tea Depot
            </h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
                className="transition-all duration-300"
              >
                <Link href={item.href} className="flex items-center gap-3">
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={logout} tooltip="Log out" className="transition-all duration-300">
                    <LogOut className="h-5 w-5" />
                    <span className="text-sm font-medium">Log out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
