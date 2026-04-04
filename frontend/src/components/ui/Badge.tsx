import { clsx } from 'clsx'

const variantStyles: Record<string, string> = {
  low: 'bg-green-100 text-green-800',
  moderate: 'bg-amber-100 text-amber-800',
  high: 'bg-orange-100 text-orange-800',
  very_high: 'bg-red-100 text-red-800',
  approved: 'bg-green-100 text-green-800',
  referred: 'bg-amber-100 text-amber-800',
  declined: 'bg-red-100 text-red-800',
  default: 'bg-gray-100 text-gray-800',
}

interface BadgeProps {
  variant: string
  children: React.ReactNode
  className?: string
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
        variantStyles[variant] || variantStyles.default,
        className
      )}
    >
      {children}
    </span>
  )
}
