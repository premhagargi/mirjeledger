'use client';

import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
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

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <Coffee className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold text-primary group-data-[collapsible=icon]:hidden">
                Brewventory
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
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton onClick={logout} tooltip="Log out">
                    <LogOut />
                    <span>Log out</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
