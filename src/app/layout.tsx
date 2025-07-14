'use client';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import TitleBar from '@/components/Bar/TitleBar';
import { useEffect } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // 禁止右键
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // 禁止 Alt + ← / Alt + →
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <html lang='en' suppressHydrationWarning>
      <body className='select-none'>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <TitleBar />
          <div className='flex min-h-screen'>{children}</div>
          <Toaster position='bottom-right' duration={1500} />
        </ThemeProvider>
      </body>
    </html>
  );
}
