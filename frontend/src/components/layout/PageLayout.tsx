import { Header } from './Header'
import { Shield } from 'lucide-react'

interface PageLayoutProps {
  children: React.ReactNode
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
        {children}
      </main>
      <footer className="border-t border-gray-200/60">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Shield className="h-3.5 w-3.5" />
            <span>RiskLens Underwriting Platform</span>
          </div>
          <p className="text-xs text-gray-300">v1.0.0</p>
        </div>
      </footer>
    </div>
  )
}
