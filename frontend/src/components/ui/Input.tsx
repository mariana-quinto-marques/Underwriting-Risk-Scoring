import { clsx } from 'clsx'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
  prefix?: string
}

export function Input({ label, error, hint, prefix, className, ...props }: InputProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {prefix ? (
        <div className="flex">
          <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm font-medium">
            {prefix}
          </span>
          <input
            className={clsx(
              'w-full px-3 py-2.5 rounded-r-lg border text-sm',
              error ? 'border-red-400' : 'border-gray-300 focus:border-teal focus:ring-1 focus:ring-teal',
              'outline-none transition-colors'
            )}
            {...props}
          />
        </div>
      ) : (
        <input
          className={clsx(
            'w-full px-3 py-2.5 rounded-lg border text-sm',
            error ? 'border-red-400' : 'border-gray-300 focus:border-teal focus:ring-1 focus:ring-teal',
            'outline-none transition-colors'
          )}
          {...props}
        />
      )}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  )
}
