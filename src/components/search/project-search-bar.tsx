'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { SEARCH_SUGGESTIONS } from '@/lib/project-search'
import { cn } from '@/lib/utils'

type ProjectSearchBarProps = {
  actionPath: string
  defaultQuery?: string
  placeholder?: string
  className?: string
  showSuggestions?: boolean
  syncFromUrl?: boolean
}

export function ProjectSearchBar({
  actionPath,
  defaultQuery = '',
  placeholder = 'Search by skill, software, or project keywords...',
  className,
  showSuggestions = true,
  syncFromUrl = false,
}: ProjectSearchBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlQuery = syncFromUrl ? (searchParams.get('q') ?? '') : defaultQuery
  const [query, setQuery] = useState(urlQuery)

  useEffect(() => {
    if (syncFromUrl) {
      setQuery(urlQuery)
    }
  }, [syncFromUrl, urlQuery])

  const submit = useCallback(
    (value: string) => {
      const trimmed = value.trim()
      const url = trimmed ? `${actionPath}?q=${encodeURIComponent(trimmed)}` : actionPath
      router.push(url)
    },
    [actionPath, router],
  )

  return (
    <div className={cn('space-y-2', className)}>
      <form
        className="flex flex-wrap items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault()
          submit(query)
        }}
      >
        <div className="relative min-w-0 flex-1">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            name="q"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={placeholder}
            className="h-10 w-full rounded-xl border border-indigo-200 bg-white pl-9 pr-3 text-sm text-indigo-950 placeholder:text-muted-foreground focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-indigo-700 px-4 text-sm font-semibold text-white transition hover:bg-indigo-800"
        >
          Search
        </button>
        {query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              router.push(actionPath)
            }}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-white px-3 text-sm font-medium text-indigo-700 transition hover:bg-indigo-50"
          >
            Clear
          </button>
        ) : null}
      </form>

      {showSuggestions ? (
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-indigo-700/70">
            Try:
          </span>
          {SEARCH_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => {
                setQuery(suggestion)
                submit(suggestion)
              }}
              className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200 transition hover:bg-indigo-100 hover:ring-indigo-300"
            >
              {suggestion}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
