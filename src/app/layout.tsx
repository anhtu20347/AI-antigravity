import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Cú Đêm · AI Tutor Xác Suất & Thống Kê (MVP)',
  description: 'Hệ thống trợ lý AI sư phạm đa phương thức theo chuẩn quy trình 4 bước',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.MathJax = {
                tex: { inlineMath: [['$', '$'], ['\\\\(', '\\\\)']], displayMath: [['$$', '$$']] },
                options: { skipHtmlTags: ['script', 'noscript', 'style', 'textarea'] }
              };
            `
          }}
        />
        <script async src="https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-mml-chtml.js" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6">
          {children}
        </main>
        <footer className="border-t-2 border-ink py-4 text-center text-xs font-bold text-gray-600 bg-white/70">
          Cú Đêm AI Tutor · Xác suất & Thống kê Đại học · Thiết kế chuẩn MVP 11 Tính năng
        </footer>
      </body>
    </html>
  );
}
