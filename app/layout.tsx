import Image from "next/image"
import "./globals.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className="container mx-auto">
        <header>
          <nav className="navbar py-2 px-4">
            <a className="navbar-start" href="/">
              <Image src="/images/compositex-web-logo.png" alt="logo" width={130} height={16} />
            </a>
            <ul className="navbar-center py-3 px-6 gap-6 rounded-full bg-base-200 border border-base-content/10">
              <li>
                <a href="/docs/getting-started" className="transition-colors hover:text-primary">
                  Getting Started
                </a>
              </li>
              <li>
                <a href="/docs/introduction" className="transition-colors hover:text-primary">
                  Documents
                </a>
              </li>
              <li>
                <a href="/explore" className="transition-colors hover:text-primary">
                  Explore
                </a>
              </li>
            </ul>
            <div className="navbar-end">
              <button className="btn btn-primary btn-sm">Free Install</button>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  )
}
