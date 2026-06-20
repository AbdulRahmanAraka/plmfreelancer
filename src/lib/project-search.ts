import { SKILL_OPTIONS, SOFTWARE_OPTIONS } from '@/config/constants'

export type ProjectSearchable = {
  title: string
  description: string
  skills?: string[]
}

export const SEARCH_SUGGESTIONS = [
  'Teamcenter',
  'Windchill',
  'ENOVIA',
  'BMIDE',
  'ITK',
  'Data Migration',
  'PLM Implementation',
] as const

function normalizeQuery(value: string): string {
  return value.trim().toLowerCase()
}

function haystackForProject(project: ProjectSearchable): string {
  const skills = (project.skills ?? []).join(' ')
  return `${project.title} ${project.description} ${skills}`.toLowerCase()
}

export function projectMatchesQuery(project: ProjectSearchable, rawQuery: string): boolean {
  const query = normalizeQuery(rawQuery)
  if (!query) return true

  const haystack = haystackForProject(project)
  if (haystack.includes(query)) return true

  const skillHit = SKILL_OPTIONS.some(
    (skill) => skill.toLowerCase().includes(query) && haystack.includes(skill.toLowerCase()),
  )
  if (skillHit) return true

  const softwareHit = SOFTWARE_OPTIONS.some((software) => {
    const softwareLower = software.toLowerCase()
    return (
      (softwareLower.includes(query) || query.includes(softwareLower.split(' ').pop() ?? '')) &&
      haystack.includes(softwareLower)
    )
  })
  if (softwareHit) return true

  const tokens = query.split(/\s+/).filter(Boolean)
  return tokens.every((token) => haystack.includes(token))
}

export function filterProjectsByQuery<T extends ProjectSearchable>(
  projects: T[],
  rawQuery: string,
): T[] {
  const query = normalizeQuery(rawQuery)
  if (!query) return projects
  return projects.filter((project) => projectMatchesQuery(project, query))
}
