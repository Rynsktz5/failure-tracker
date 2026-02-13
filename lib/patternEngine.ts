import { Failure } from "./storage"

export type Insight = {
  id: string
  message: string
  date: string
  seen: boolean
}

const INSIGHT_KEY = "growth_insights"

export function getInsights(): Insight[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem(INSIGHT_KEY)
  return data ? JSON.parse(data) : []
}

export function saveInsight(insight: Insight) {
  const existing = getInsights()
  localStorage.setItem(
    INSIGHT_KEY,
    JSON.stringify([insight, ...existing])
  )
}

export async function runPatternCheck(failures: Failure[]) {
  if (failures.length < 3) return

  const now = new Date()
  const last7Days = failures.filter(f => {
    const diff =
      (now.getTime() - new Date(f.date).getTime()) /
      (1000 * 60 * 60 * 24)
    return diff <= 7
  })

  const categoryCount: Record<string, number> = {}

  last7Days.forEach(f => {
    categoryCount[f.category] =
      (categoryCount[f.category] || 0) + 1
  })

  for (const category in categoryCount) {
    if (categoryCount[category] >= 3) {
      const text = `
The user has logged ${categoryCount[category]} ${category} failures in the last 7 days.
This suggests a repeated friction area.
Provide a positive, encouraging insight.
      `

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text,
          mode: "pattern"
        })
      })

      const data = await res.json()

      saveInsight({
        id: crypto.randomUUID(),
        message: data.output,
        date: new Date().toISOString(),
        seen: false
      })

      return
    }
  }
}
