'use client';

import Header from '@/components/layout/header/Header';
import { useZoomLevel } from '@/hooks/core/useZoomLevel.hook';

const RootLayoutWrapper: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const isZoomedOut = useZoomLevel();

  return (
    <div
      className={`flex min-h-screen flex-col ${isZoomedOut ? 'm-auto max-w-screen-2xl' : ''
        }`}
    >
      <Header />
      <main className="base-padding flex-1 py-5">{children}</main>
    </div>
  );
};

export default RootLayoutWrapper;
