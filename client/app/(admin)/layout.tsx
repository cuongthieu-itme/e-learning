import { GeistSans } from 'geist/font/sans';
import { Metadata } from 'next';

import { Toaster } from '@/components/ui/info/toaster';
import { QueryContextProvider } from '@/context/react-query-client';
import '../globals.css';
import AdminLayoutWrapper from './_AdminLayoutWrapper';

export const metadata: Metadata = {
  icons: 'favicon.ico',
  title: {
    default: 'E-Learning | Hệ thống giảng dạy trực tuyến',
    template: '%s | E-Learning',
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <QueryContextProvider>
          <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
          <Toaster />
        </QueryContextProvider>
      </body>
    </html>
  );
}
