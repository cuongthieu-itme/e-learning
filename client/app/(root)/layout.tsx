import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';

import { AuthProvider } from '@/components/shared/AuthProvider';
import { QueryContextProvider } from '@/context/react-query-client';

import { Toaster } from '@/components/ui/info/toaster';
import '../globals.css';
import RootLayoutWrapper from './_RootLayoutWrapper';

export const metadata: Metadata = {
  icons: 'favicon.ico',
  title: {
    default: 'E-Learning | Hệ thống giảng dạy trực tuyến',
    template: '%s | E-Learning',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={GeistSans.className} suppressHydrationWarning>
        <QueryContextProvider>
          <AuthProvider>
            <RootLayoutWrapper>{children}</RootLayoutWrapper>
          </AuthProvider>
          <Toaster />
        </QueryContextProvider>
      </body>
    </html>
  );
}
