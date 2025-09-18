// app/layout.tsx
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <header>
          <h1>謎解きクイズ</h1>
        </header>
        <main>{children}</main>
        <footer>
          <small>©2025 3AHR</small>
        </footer>
      </body>
    </html>
  );
}
