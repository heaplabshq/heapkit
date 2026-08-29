import { Suspense } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { GithubIcon, Logo } from './icons'

const NAV = [
  { to: '/json-formatter', label: 'JSON', prefix: '/json' },
  { to: '/yaml-validator', label: 'YAML', prefix: '/yaml' },
  { to: '/uuid-generator', label: 'UUID', prefix: '/uuid' },
  { to: '/base64', label: 'Base64', prefix: '/base64' },
  { to: '/hash-generator', label: 'Hash', prefix: '/hash' },
  { to: '/jwt-decoder', label: 'JWT', prefix: '/jwt' },
  { to: '/cron-builder', label: 'Cron', prefix: '/cron' },
  { to: '/emi-calculator', label: 'EMI', prefix: '/emi' },
  { to: '/mutual-fund-calculator', label: 'Mutual Fund', prefix: '/mutual-fund' },
]

export function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="relative flex min-h-svh w-full flex-col">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-10rem] h-80 w-[52rem] max-w-[120vw] -translate-x-1/2 rounded-full bg-accent-subtle blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="flex h-14 w-full items-center gap-6 px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="flex shrink-0 items-center gap-2 text-[15px] font-semibold tracking-tight text-ink-strong"
          >
            <Logo className="h-6 w-6" />
            heapkit
          </Link>

          <nav className="no-scrollbar flex items-center gap-1 overflow-x-auto text-sm">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.prefix)
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`whitespace-nowrap rounded-md px-2.5 py-1.5 font-medium transition ${
                    active
                      ? 'bg-accent-subtle text-accent'
                      : 'text-ink hover:bg-surface-muted hover:text-ink-strong'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      <main className="w-full flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="flex justify-center py-24">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>

      <footer className="border-t border-border">
        <div className="flex w-full flex-col items-center gap-3 px-4 py-8 text-center text-sm text-ink sm:flex-row sm:justify-between sm:px-6 sm:text-left lg:px-8">
          <p>© {new Date().getFullYear()} heapkit — nothing you enter is ever sent to a server.</p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="transition hover:text-ink-strong">
              Privacy
            </Link>
            <a
              href="https://github.com/heaplabshq/heapkit"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 transition hover:text-ink-strong"
            >
              <GithubIcon className="h-4 w-4" />
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}