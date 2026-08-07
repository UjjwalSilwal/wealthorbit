import type { Metadata } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import '@/styles/globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProviders' 

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'WealthOrbit - Smart Stock Market Investing',
  description: 'Advanced stock market platform for intelligent investing with real-time data, AI-powered insights, and professional tools.',
  keywords: 'stock market, investing, trading, wealth management, financial technology',
  authors: [{ name: 'WealthOrbit' }],
  openGraph: {
    title: 'WealthOrbit - Smart Stock Market Investing',
    description: 'Advanced stock market platform for intelligent investing',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}