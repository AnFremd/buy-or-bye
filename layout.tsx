export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, backgroundColor: 'black' }}>{children}</body>
    </html>
  )
}
