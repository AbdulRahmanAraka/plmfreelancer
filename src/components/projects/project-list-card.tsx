import Link from 'next/link'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ProjectListCardProps = {
  projectId: number
  projectTitle: string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function ProjectListCard({
  projectId,
  projectTitle,
  children,
  footer,
  className,
}: ProjectListCardProps) {
  return (
    <article
      className={cn(
        'group relative rounded-xl border border-border bg-white px-4 py-3 transition hover:border-indigo-300 hover:bg-indigo-50/40 hover:shadow-sm',
        className,
      )}
    >
      <Link
        href={`/projects/${projectId}`}
        className="absolute inset-0 z-0 rounded-xl cursor-pointer"
        aria-label={`View project: ${projectTitle}`}
      />
      <div className="relative z-1 pointer-events-none">{children}</div>
      {footer ? (
        <div className="relative z-1 mt-3 pointer-events-auto">{footer}</div>
      ) : null}
    </article>
  )
}
