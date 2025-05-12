import { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';

import { QueryContextProvider } from '@/context/react-query-client';

import '../globals.css';
import AuthLayoutWrapper from './_AuthLayoutWrapper';
import { Toaster } from '@/components/ui/info/toaster';

export const metadata: Metadata = {
  icons: 'favicon.ico',
  title: {
    default: 'DzenvoShop | Your Online Ecommerce Store',
    template: '%s | DzenvoShop',
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
