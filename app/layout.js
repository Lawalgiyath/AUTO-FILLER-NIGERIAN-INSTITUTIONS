import './globals.css'

export const metadata = {
  title: 'UNILAG Staff Form AutoFiller',
  description: 'Automated system for filling Google Forms with University of Lagos staff information',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
