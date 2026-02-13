"use client"

import { useEffect, useMemo, useState } from "react"
import Header from "@/components/Header"
import StatCard from "@/components/StatCard"
import FailureModal from "@/components/FailureModal"
import FailureChart from "@/components/FailureChart"
import { getFailures, Failure } from "@/lib/storage"
import Link from "next/link"
import { getInsights } from "@/lib/patternEngine"

export default function Home() {
  const [failures, setFailures] = useState<Failure[]>([])
  const [open, setOpen] = useState(false)
  const [hasNewInsight, setHasNewInsight] = useState(false)

  useEffect(() => {
    setFailures(getFailures())
  }, [open])

  useEffect(() => {
    const insights = getInsights()
    const unseen = insights.some(i => !i.seen)
    setHasNewInsight(unseen)
  }, [open])

  const totalFailures = useMemo(() => failures.length, [failures])

  const retryRate = useMemo(() => {
    if (failures.length === 0) return 0
    const retryCount = failures.filter(f => f.retry).length
    return Math.round((retryCount / failures.length) * 100)
  }, [failures])

  const lastFailureDate = useMemo(() => {
    if (failures.length === 0) return "None"
    return new Date(failures[0].date).toLocaleDateString()
  }, [failures])

  const streak = useMemo(() => {
    if (failures.length === 0) return 0

    const uniqueDays = Array.from(
      new Set(
        failures.map(f =>
          new Date(f.date).toISOString().split("T")[0]
        )
      )
    )

    uniqueDays.sort(
      (a, b) =>
        new Date(b).getTime() - new Date(a).getTime()
    )

    let streakCount = 1

    for (let i = 1; i < uniqueDays.length; i++) {
      const prev = new Date(uniqueDays[i - 1])
      const curr = new Date(uniqueDays[i])

      const diff =
        (prev.getTime() - curr.getTime()) /
        (1000 * 60 * 60 * 24)

      if (diff === 1) {
        streakCount++
      } else {
        break
      }
    }

    return streakCount
  }, [failures])

  return (
    <>
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* 🔔 Insight Banner */}
        {hasNewInsight && (
          <Link
            href="/insights"
            className="block mb-6 text-red-500 hover:text-red-400 transition drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]"
          >
            A growth insight is ready for you (Click here)
          </Link>
        )}

        {/* 📊 Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Failures" value={totalFailures} />
          <StatCard label="Last Failure" value={lastFailureDate} />
          <StatCard label="Failure Streak (Days)" value={streak} />
          <StatCard label="Retry Rate (%)" value={`${retryRate}%`} />
        </div>

        {/* Buttons */}
<div className="mt-8 grid grid-cols-1 gap-3 sm:flex sm:flex-row">
  <button
    onClick={() => setOpen(true)}
    className="w-full bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-bold transition-all duration-300"
  >
    + Log Failure
  </button>

  <Link
    href="/failures"
    className="w-full text-center bg-neutral-800 px-6 py-3 rounded-xl font-bold hover:bg-neutral-700 transition"
  >
    View Failures
  </Link>

  <Link
    href="/analyzer"
    className="w-full text-center bg-neutral-800 px-6 py-3 rounded-xl font-bold hover:bg-neutral-700 transition"
  >
    AI Analyzer
  </Link>
</div>


        {/* 📈 Chart */}
        <div className="mt-10">
          <FailureChart failures={failures} />
        </div>

      </main>

      {open && <FailureModal onClose={() => setOpen(false)} />}
    </>
  )
}
