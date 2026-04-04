import { Link, useLocation } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { clsx } from 'clsx'

const navItems = [
  { path: '/', label: 'New Submission' },
  { path: '/history', label: 'History' },
  { path: '/portfolio', label: 'Portfolio' },
]

export function Header() {
  const location = useLocation()

  return (
    <header className="bg-slate-900 text-white">
      <div className="flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2.5 no-underline text-white">
          <Shield className="h-7 w-7 text-teal-light" />
          <span className="text-xl font-bold tracking-tight">RiskLens</span>
          <span className="text-xs text-slate-400 ml-1 hidden sm:inline">Underwriting Platform</span>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors no-underline',
                location.pathname === item.path
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
