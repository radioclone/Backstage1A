import './globals.css';
import type { Metadata } from 'next';
import SequenceProvider from '@/components/SequenceProvider';

export const metadata: Metadata = {
  title: 'BACKSPACE FESTIVAL',
  description: 'An underground 3D music festival with token gating, multi-user chat, and continuous audio',
  keywords: 'techno, underground, music festival, 3D, web3, token gating, chat, audio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SequenceProvider>
          {children}
        </SequenceProvider>
      </body>
    </html>
  );
}
