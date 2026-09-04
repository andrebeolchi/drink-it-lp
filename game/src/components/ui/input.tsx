import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react'

import { cn } from '@/components/ui/cn'
import { Text } from '@/components/ui/text'

interface BaseProps {
  label?: string
  error?: string
  className?: string
  multiline?: boolean
}

type Props = BaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement> & TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'>

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, Props>(function Input(
  { label, error, className, multiline, rows, ...props },
  ref
) {
  const fieldClasses = cn(
    'w-full rounded-md border border-border bg-surface-raised px-4 py-3 text-base text-foreground placeholder:text-subtle focus:border-brand focus:outline-none',
    error && 'border-danger',
    className
  )

  return (
    <div className="flex flex-col gap-1">
      {label ? (
        <Text as="label" className="text-sm font-medium text-muted">
          {label}
        </Text>
      ) : null}
      {multiline ? (
        <textarea
          ref={ref as React.Ref<HTMLTextAreaElement>}
          rows={rows ?? 3}
          className={fieldClasses}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          className={fieldClasses}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error ? (
        <Text className="text-xs text-danger" as="span">
          {error}
        </Text>
      ) : null}
    </div>
  )
})
