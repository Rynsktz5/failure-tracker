"use client"

import { useState } from "react"
import { getFailures } from "@/lib/storage"
import { animate } from "animejs"
import Link from "next/link"

export default function AnalyzerPage() {
  const [output, setOutput] = useState("")
  const [loading, setLoading] = useState(false)

  const analyze = async () => {
  const failures = getFailures()

  if (failures.length === 0) {
    setOutput("No failures to analyze yet.")
    return
  }

  // 🔥 Only analyze the most recent failure
  const latestFailure = failures[0]

  const text = `
Failure Title: ${latestFailure.title}
Category: ${latestFailure.category}
Reason: ${latestFailure.reason}
Lesson: ${latestFailure.lesson}
Retry Decision: ${latestFailure.retry ? "Will Retry" : "Won’t Retry"}
  `

  setLoading(true)
  setOutput("")

  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ text })
  })

  const data = await res.json()

  setOutput(data.output)
  setLoading(false)

  animate(".ai-output", {
    opacity: [0, 1],
    translateY: [10, 0],
    duration: 400,
    easing: "ease-out"
  })
}

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-red-500">
          AI Growth Analyzer
        </h1>
        <p className="text-sm text-neutral-500 mb-6">
  ⚠ Only analyzes the most recently logged failure.
</p>


        <Link
          href="/"
          className="bg-neutral-800 px-4 py-2 rounded hover:bg-neutral-700 transition"
        >
          ← Back
        </Link>
      </div>

      <button
        onClick={analyze}
        disabled={loading}
        className="bg-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition"
      >
        {loading ? "Analyzing..." : "Analyze My Growth"}
      </button>

      {output && (
        <div className="ai-output mt-8 bg-neutral-900 border border-neutral-800 p-6 rounded-xl text-neutral-300">
          {output}
        </div>
      )}
    </main>
  )
}
