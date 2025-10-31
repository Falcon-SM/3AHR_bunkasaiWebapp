// app/layout.tsx
import './globals.css';
import { RiddlesProvider } from './context/riddleContext';
import TimeUpdater from '@/components/TimeUpdater';
import FooterRoomNum from '@/components/FooterRoomNum';
import ErrorLogger from '@/components/ErrorLogger';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <title>3AHR</title>
      </head>
      <body>
          <RiddlesProvider>
          <ErrorLogger />
          <TimeUpdater />
          <header>
            <h1 style={{fontWeight:450,fontSize:45}}>LOCKED FESTIVALへようこそ！</h1>
          </header>
          <main>{children}</main>
          <footer>
            <FooterRoomNum />
            <small>©2025 3AHR</small>
          </footer>
        </RiddlesProvider>
      </body>
    </html>
  );
}
