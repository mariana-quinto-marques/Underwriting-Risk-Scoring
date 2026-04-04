import { clsx } from 'clsx'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: { value: string; label: string; description?: string }[]
  error?: string
  hint?: string
}

export function Select({ label, options, error, hint, className, ...props }: SelectProps) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        className={clsx(
          'w-full px-3 py-2.5 rounded-lg border text-sm bg-white',
          error ? 'border-red-400' : 'border-gray-300 focus:border-teal focus:ring-1 focus:ring-teal',
          'outline-none transition-colors'
        )}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  )
}
