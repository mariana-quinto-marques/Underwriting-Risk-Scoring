import { clsx } from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  borderColor?: string
}

export function Card({ children, className, borderColor }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white rounded-xl shadow-sm border border-gray-100 p-6',
        borderColor && `border-l-4 ${borderColor}`,
        className
      )}
    >
      {children}
    </div>
  )
}
