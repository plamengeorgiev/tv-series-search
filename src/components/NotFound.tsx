import { Link } from 'react-router'

interface NotFoundProps {
  title: string
  message: string
}

export function NotFound({ title, message }: NotFoundProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <h1 className="text-2xl font-bold text-ink">{title}</h1>
      <p className="text-ink-muted">{message}</p>
      <Link to="/" className="text-accent underline hover:text-accent-strong">
        Back to search
      </Link>
    </div>
  )
}
