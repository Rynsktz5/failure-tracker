"use client"

import { useEffect, useState } from "react"
import { getInsights } from "@/lib/patternEngine"
import { animate } from "animejs"
import Link from "next/link"

export default function InsightsPage() {
  const [insights, setInsights] = useState<any[]>([])

  useEffect(() => {
    const data = getInsights()
    setInsights(data)

    animate(".insight-card", {
      translateY: [20, 0],
      opacity: [0, 1],
      delay: (_, i) => i * 80,
      duration: 400,
      easing: "ease-out"
    })
  }, [])

  const markAsSeen = (id: string) => {
    const updated = insights.map(i =>
      i.id === id ? { ...i, seen: true } : i
    )

    localStorage.setItem(
      "growth_insights",
      JSON.stringify(updated)
    )

    setInsights(updated)
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-yellow-400">
          Growth Insights
        </h1>
        <p className="text-sm text-neutral-500 mt-2">
  This space is private. Your growth stays here.
</p>


        <Link
          href="/"
          className="bg-neutral-800 px-4 py-2 rounded hover:bg-neutral-700 transition"
        >
          ← Back
        </Link>
      </div>

      {insights.length === 0 && (
        <p className="text-neutral-500">
          No insights generated yet.
        </p>
      )}

      <div className="space-y-6">
        {insights.map(insight => (
          <div
            key={insight.id}
            className={`insight-card p-6 rounded-xl border ${
              insight.seen
                ? "bg-neutral-900 border-neutral-800"
                : "bg-yellow-900/20 border-yellow-500"
            }`}
          >
            <p className="text-neutral-300 mb-4">
              {insight.message}
            </p>

            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-500">
                {new Date(insight.date).toLocaleString()}
              </span>

              {!insight.seen && (
                <button
                  onClick={() => markAsSeen(insight.id)}
                  className="text-sm bg-yellow-500 px-3 py-1 rounded text-black hover:bg-yellow-400 transition"
                >
                  Mark as Read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
