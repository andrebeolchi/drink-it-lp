import type { ReactNode } from 'react'

// Minimal dependency-free renderer for the small markdown subset used in
// card rules text: paragraphs, bullet lists (`- item`), **bold** and *italic*.
// Not a general-purpose markdown parser — deck copy is app-authored content,
// not user input, so this only needs to cover what actually appears there.
function renderInline(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={i} className="text-muted">
          {part.slice(1, -1)}
        </em>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export function SimpleMarkdown({ content }: { content: string }) {
  const blocks = content.trim().split(/\n\n+/)

  return (
    <div className="flex flex-col gap-2 text-sm leading-relaxed text-muted">
      {blocks.map((block, i) => {
        const lines = block.split('\n').filter(Boolean)
        const isList = lines.every((l) => l.trim().startsWith('- '))

        if (isList) {
          return (
            <ul key={i} className="list-disc space-y-1 pl-5">
              {lines.map((line, j) => (
                <li key={j}>{renderInline(line.trim().slice(2))}</li>
              ))}
            </ul>
          )
        }

        return <p key={i}>{renderInline(block)}</p>
      })}
    </div>
  )
}
