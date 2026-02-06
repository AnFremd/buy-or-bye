import 'tailwindcss/tailwind.css';
import { ClerkProvider } from '@clerk/nextjs'

export const metadata = {
  title: 'BUYorBYE',
  description: 'Financial Consciousness',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="ru">
        <body style={{ margin: 0, backgroundColor: 'black' }}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
