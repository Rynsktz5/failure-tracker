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
      translateY: [16, 0],
      opacity: [0, 1],
      duration: 600,
      easing: "ease-out"
    })
  }, [])

  return (
    <div
      ref={ref}
      className="
        bg-neutral-900/90 
        border border-neutral-800 
        p-5 sm:p-6 
        rounded-2xl 
        shadow-md 
        w-full
        transition-all duration-300
        hover:border-neutral-700
      "
    >
      <h2 className="text-neutral-400 text-xs sm:text-sm tracking-wide">
        {label}
      </h2>

      <p className="text-xl sm:text-2xl font-bold mt-2 text-red-400">
        {value}
      </p>
    </div>
  )
}
