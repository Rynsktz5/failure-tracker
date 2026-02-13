export type Failure = {
  id: string
  title: string
  category: string
  reason: string       
  lesson: string
  retry: boolean
  date: string
}



const STORAGE_KEY = "failures"

export function getFailures(): Failure[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function saveFailure(failure: Failure) {
  const existing = getFailures()
  localStorage.setItem(STORAGE_KEY, JSON.stringify([failure, ...existing]))
}
