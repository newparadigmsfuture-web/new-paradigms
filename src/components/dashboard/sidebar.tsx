'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types';
import {
  GraduationCap,
  Calendar,
  Users,
  FileText,
  MessageSquare,
  BarChart3,
  Settings,
  TrendingUp,
  BookOpen,
  UserCog,
  LayoutDashboard,
  Brain,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const educatorNav: NavItem[] = [
  { label: 'Dashboard', href: '/educator', icon: LayoutDashboard },
  { label: 'Calendar', href: '/educator/calendar', icon: Calendar },
  { label: 'My Performance', href: '/educator/performance', icon: TrendingUp },
  { label: 'Resources', href: '/educator/resources', icon: BookOpen },
  { label: 'Messages', href: '/educator/messages', icon: MessageSquare },
  { label: 'Settings', href: '/educator/settings', icon: Settings },
];

const trainerNav: NavItem[] = [
  { label: 'Dashboard', href: '/trainer', icon: LayoutDashboard },
  { label: 'My Team', href: '/trainer/team', icon: Users },
  { label: 'Content', href: '/trainer/content', icon: FileText },
  { label: 'Performance', href: '/trainer/performance', icon: BarChart3 },
  { label: 'Training Schedule', href: '/trainer/schedule', icon: Calendar },
  { label: 'Messages', href: '/trainer/messages', icon: MessageSquare },
  { label: 'Settings', href: '/trainer/settings', icon: Settings },
];

const adminNav: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: UserCog },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'AI Insights', href: '/admin/insights', icon: Brain },
  { label: 'Resources', href: '/admin/resources', icon: FileText },
  { label: 'Messages', href: '/admin/messages', icon: MessageSquare },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

const navByRole: Record<UserRole, NavItem[]> = {
  educator: educatorNav,
  trainer: trainerNav,
  admin: adminNav,
};

interface SidebarProps {
  role: UserRole;
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const navItems = navByRole[role];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-2 border-b px-6">
          <GraduationCap className="h-7 w-7 text-primary" />
          <span className="font-bold text-lg">New Paradigms</span>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t p-4">
          <div className="rounded-lg bg-muted p-3">
            <p className="text-xs text-muted-foreground">
              Role: <span className="capitalize font-medium">{role}</span>
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
