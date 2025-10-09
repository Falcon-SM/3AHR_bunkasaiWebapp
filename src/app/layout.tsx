// app/layout.tsx
import './globals.css';
import { RiddlesProvider } from './context/riddleContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <title>3AHR</title>
      </head>
      <body>
        <RiddlesProvider>
          <header>
            <h1>3AHRの謎解きへようこそ！</h1>
          </header>
          <main>{children}</main>
          <footer>
            <small>©2025 3AHR</small>
          </footer>
        </RiddlesProvider>
      </body>
    </html>
  );
}
