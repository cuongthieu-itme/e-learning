'use client';

import { useAuthStore } from '@/store/auth.store';
import {
  ChevronsUpDown,
  LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import {
  Avatar,
  AvatarFallback
} from '@/components/ui/info/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/layout/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/layout/sidebar';
import { Skeleton } from '@/components/ui/utilities/skeleton';

const UserInfo: React.FC = () => {
  const { user, isLoading, logout } = useAuthStore();
  const router = useRouter();

  // Handle logout with redirection
  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Generate initials from role
  const getInitials = () => {
    if (!user?.role) return 'U';
    return user.role.substring(0, 2).toUpperCase();
  };

  // Handle loading state
  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 p-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1">
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-4 w-4 ml-auto" />
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const roleDisplay = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User';
  const initials = getInitials();

  const getLabelRole = () => {
    switch (user?.role) {
      case 'admin':
        return 'Quản trị viên';
      case 'teacher':
        return 'Giảng viên';
      default:
        return '';
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-hover transition-colors duration-200"
            >
              <Avatar className="h-8 w-8 rounded-full border border-border">
                <AvatarFallback className="rounded-full bg-primary/10 text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{roleDisplay}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {getLabelRole()}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-2 text-left text-sm">
                <Avatar className="h-10 w-10 rounded-full border border-border">
                  <AvatarFallback className="rounded-full bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left leading-tight">
                  <span className="truncate font-semibold text-base">
                    {roleDisplay}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {getLabelRole()}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive hover:text-destructive"
            >
              <LogOut className="mr-2 size-4" />
              Đăng xuất
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default UserInfo;
