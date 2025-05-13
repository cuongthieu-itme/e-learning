import { GeistSans } from 'geist/font/sans';
import { Metadata } from 'next';

import { QueryContextProvider } from '@/context/react-query-client';

import { Toaster } from '@/components/ui/info/toaster';
import '../globals.css';
import AuthLayoutWrapper from './_AuthLayoutWrapper';

export const metadata: Metadata = {
  icons: 'favicon.ico',
  title: {
    default: 'E-Learning | Hệ thống giảng dạy trực tuyến',
    template: '%s | E-Learning',
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <QueryContextProvider>
          <AuthLayoutWrapper>{children}</AuthLayoutWrapper>
          <Toaster />
        </QueryContextProvider>
      </body>
    </html>
  );
}
