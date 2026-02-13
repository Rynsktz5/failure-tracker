"use client"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import { Failure } from "@/lib/storage"

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

export default function FailureChart({ failures }: { failures: Failure[] }) {
  const categoryCount: Record<string, number> = {}

  failures.forEach((f) => {
    categoryCount[f.category] = (categoryCount[f.category] || 0) + 1
  })

  const data = {
    labels: Object.keys(categoryCount),
    datasets: [
      {
        label: "Failures",
        data: Object.values(categoryCount),
        backgroundColor: "rgba(239,68,68,0.6)",
      },
    ],
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl mt-6">
      <Bar data={data} />
    </div>
  )
}
