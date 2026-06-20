'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type HomeProjectSearchProps = {
  isLoggedIn: boolean
  userRole?: string | null
  className?: string
}

function searchDestination(query: string): string {
  return `/freelancer?q=${encodeURIComponent(query)}`
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
}

export function HomeProjectSearch({ isLoggedIn, userRole, className }: HomeProjectSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [loginPromptOpen, setLoginPromptOpen] = useState(false)
  const [pendingQuery, setPendingQuery] = useState('')

  useEffect(() => {
    if (!loginPromptOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLoginPromptOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [loginPromptOpen])

  function handleSearch(value: string) {
    const trimmed = value.trim()
    if (!trimmed) return

    const destination = searchDestination(trimmed)

    if (!isLoggedIn) {
      setPendingQuery(trimmed)
      setLoginPromptOpen(true)
      return
    }

    if (userRole === 'client') {
      router.push('/client')
      return
    }

    router.push(destination)
  }

  const loginHref = pendingQuery
    ? `/login?next=${encodeURIComponent(searchDestination(pendingQuery))}`
    : '/login'

  return (
    <>
      <form
        className={cn(
          'absolute right-8 top-10 z-20 w-[min(100%,18rem)] sm:right-12 sm:top-12 sm:w-72 md:right-16 md:top-14 md:w-80',
          className,
        )}
        onSubmit={(event) => {
          event.preventDefault()
          handleSearch(query)
        }}
      >
        <div className="relative flex items-center">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects..."
            aria-label="Search PLM projects"
            className="h-10 w-full rounded-full border border-white/20 bg-white/10 py-2 pl-4 pr-11 text-sm text-white shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-md placeholder:text-sky-100/60 focus:border-sky-300/50 focus:bg-white/15 focus:outline-none focus:ring-2 focus:ring-sky-400/30"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-1 flex h-8 w-8 items-center justify-center rounded-full text-sky-100 transition hover:bg-white/15 hover:text-white"
          >
            <SearchIcon />
          </button>
        </div>
      </form>

      {loginPromptOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/50 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="login-prompt-title"
          onClick={() => setLoginPromptOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-border bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="login-prompt-title" className="text-base font-semibold text-indigo-950">
                  Please login first
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sign in to search and browse open PLM projects
                  {pendingQuery ? (
                    <>
                      {' '}
                      for{' '}
                      <span className="font-semibold text-indigo-900">
                        &ldquo;{pendingQuery}&rdquo;
                      </span>
                    </>
                  ) : null}
                  .
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setLoginPromptOpen(false)}
              >
                Cancel
              </Button>
              <Link
                href={loginHref}
                className="inline-flex h-10 items-center justify-center rounded-xl bg-indigo-700 px-4 text-sm font-semibold text-white transition hover:bg-indigo-800"
                onClick={() => setLoginPromptOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
