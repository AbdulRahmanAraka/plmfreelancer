import { cn } from '@/lib/utils'

type ProjectSkillsListProps = {
  skills: string[]
  className?: string
  label?: string
}

export function ProjectSkillsList({
  skills,
  className,
  label = 'Required skills',
}: ProjectSkillsListProps) {
  if (skills.length === 0) return null

  return (
    <div className={cn('space-y-1.5', className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700/70">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}
