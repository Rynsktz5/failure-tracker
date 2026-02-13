"use client"

import { useEffect, useRef } from "react"
import { animate } from "animejs"



type Props = {
  label: string
  value: string | number
}

export default function StatCard({ label, value }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return

    animate(ref.current, {
  translateY: [20, 0],
  opacity: [0, 1],
  duration: 700,
  easing: "ease-out"
})

  }, [])

  return (
    <div
      ref={ref}
      className="bg-neutral-900 border border-neutral-800 p-6 rounded-2xl shadow-lg"
    >
      <h2 className="text-neutral-400 text-sm">{label}</h2>
      <p className="text-2xl font-bold mt-2 text-red-400">{value}</p>
    </div>
  )
}
