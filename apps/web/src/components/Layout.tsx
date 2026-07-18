import { Suspense } from 'react'
import { Link, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-3xl flex-col px-6">
      <header className="flex items-center justify-between border-b border-border py-5">
        <Link to="/" className="text-lg font-medium tracking-tight text-ink-strong">
          heapkit
        </Link>
        <nav className="flex gap-4 text-sm text-ink">
          <Link to="/json-formatter" className="hover:text-ink-strong">
            JSON
          </Link>
          <Link to="/yaml-validator" className="hover:text-ink-strong">
            YAML
          </Link>
          <Link to="/uuid-generator" className="hover:text-ink-strong">
            UUID
          </Link>
          <Link to="/base64" className="hover:text-ink-strong">
            Base64
          </Link>
          <Link to="/hash-generator" className="hover:text-ink-strong">
            Hash
          </Link>
          <Link to="/jwt-decoder" className="hover:text-ink-strong">
            JWT
          </Link>
          <Link to="/cron-builder" className="hover:text-ink-strong">
            Cron
          </Link>
        </nav>
      </header>

      <main className="flex-1 py-10">
        <Suspense fallback={<p className="py-20 text-center text-sm text-ink">Loading…</p>}>
          <Outlet />
        </Suspense>
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-ink">
        heapkit — free, browser-only developer tools. Nothing you enter is ever sent to a server.
      </footer>
    </div>
  )
}
