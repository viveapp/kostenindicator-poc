import type { Metadata, Viewport } from 'next'
import { Space_Grotesk } from 'next/font/google'

import './globals.css'

/**
 * Stand-in voor Monument Grotesk, de merkletter uit de brand guide. Die is
 * gelicentieerd en hier niet beschikbaar; Space Grotesk heeft dezelfde
 * neo-grotesk inslag en de drie gewichten die het merk gebruikt (Regular,
 * Medium, Bold).
 */
const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'Vive · Kostenindicator werkgeverspensioen',
  description:
    'Prototype: vul drie stappen in en zie wat een pensioenregeling de werkgever kost — en wat er gemiddeld bij de werknemer terechtkomt.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="nl" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  )
}
