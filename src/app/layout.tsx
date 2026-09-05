import type { Metadata } from 'next';
import './globals.css';
import { KioskProvider } from '@/context/KioskContext';

export const metadata: Metadata = {
  title: 'Muqimiy Aql Markazi',
  description: 'Bilim. Kasb. Til. Ko\'mak. AI. — Mahalla fuqarolari uchun zamonaviy raqamli xizmatlar markazi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-slate-50 text-slate-900" style={{ fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" }}>
        <KioskProvider>{children}</KioskProvider>
      </body>
    </html>
  );
}
