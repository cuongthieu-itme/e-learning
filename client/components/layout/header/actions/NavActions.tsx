'use client';

import { LogOut, User } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { useAuthStore } from '@/store/auth.store';

import Logo from '../Logo';

import { Button } from '@/components/ui/buttons/button';
import { TooltipWrapper } from '@/components/ui/info/tooltip-wrapper';
import { getRoleSpecificData } from '@/lib/utils/auth.utils';

const NavActions: React.FC<{
  showSearch?: boolean;
}> = ({ showSearch = true }) => {
  const { user, isAuthenticated, logout } = useAuthStore();

  const isAdmin = user ? (user.role === 'admin' || user.role === 'teacher') : false;
  const roleData = getRoleSpecificData(isAdmin);

  return (
    <div className="base-padding hide-scrollbar flex items-center justify-between gap-10 bg-white py-5">
      <div>
        <Logo />
      </div>

      {/* {showSearch && (
        <div className="basis-1/3">
          <NavSearch />
        </div>
      )} */}

      <div className="flex items-center gap-5">
        {isAuthenticated &&
          roleData.actions.map(({ id, icon, text, href }) => (
            <TooltipWrapper key={id} tooltip={text}>
              <Link href={href}>{React.createElement(icon)}</Link>
            </TooltipWrapper>
          ))}

        {!isAuthenticated && (
          <Link href="/signup">
            <Button>
              <User />
              Signup
            </Button>
          </Link>
        )}

        {isAuthenticated && (
          <button onClick={logout}>
            <LogOut />
          </button>
        )}
      </div>
    </div>
  );
};

export default NavActions;
