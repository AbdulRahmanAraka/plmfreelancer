import { cn } from '@/lib/utils'

type ProjectDescriptionPreviewProps = {
  description: string
  projectId: number
  maxLines?: 2 | 3
  className?: string
  showReadMore?: boolean
}

export function ProjectDescriptionPreview({
  description,
  projectId,
  maxLines = 2,
  className,
  showReadMore = true,
}: ProjectDescriptionPreviewProps) {
  void projectId
  const lineClamp = maxLines === 3 ? 'line-clamp-3' : 'line-clamp-2'
  const needsTruncation = description.length > 120

  return (
    <div className={cn('mt-1', className)}>
      <p className={cn('text-sm text-muted-foreground', lineClamp)}>{description}</p>
      {showReadMore && needsTruncation ? (
        <span className="mt-1 inline-block text-xs font-semibold text-indigo-700 group-hover:underline">
          Read more...
        </span>
      ) : null}
    </div>
  )
}
