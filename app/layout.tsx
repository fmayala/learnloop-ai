import { Toaster } from 'react-hot-toast'

import '@/app/globals.css'
import { cn } from '@/lib/utils'
import { Providers } from '@/components/providers'
import { Header } from '@/components/header'
import { OtherLayout } from '@/components/layout/OtherLayout'
import { AI } from './shared'

export const metadata = {
  metadataBase: new URL(`http://localhost:3000`),
  title: {
    default: 'Learnloop AI',
    template: `Learn better.`
  },
  description: 'An AI-powered revolving lesson plan for students and teachers.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ]
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-sans antialiased')}>
        <AI>
          <Toaster
            toastOptions={{
              style: {
                background: '#27272a',
                color: '#fff'
              }
            }}
          />
          <Providers
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex flex-col flex-1">
                <OtherLayout>{children}</OtherLayout>
              </main>
            </div>
          </Providers>
        </AI>
      </body>
    </html>
  )
}
