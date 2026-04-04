import { clsx } from 'clsx'

const variants: Record<string, string> = {
  primary: 'bg-navy text-white hover:bg-navy-light',
  secondary: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  teal: 'bg-teal text-white hover:bg-teal-light',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'teal'
  loading?: boolean
}

export function Button({ variant = 'primary', loading, children, className, disabled, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium text-sm transition-colors cursor-pointer',
        variants[variant],
        (disabled || loading) && 'opacity-60 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  )
}
