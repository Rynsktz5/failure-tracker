"use client"

import { useState, useEffect, useRef } from "react"
import { saveFailure } from "@/lib/storage"
import { animate } from "animejs"
import { v4 as uuid } from "uuid"
import { runPatternCheck } from "@/lib/patternEngine"

const CATEGORIES = [
  "Project",
  "Personal",
  "Idea",
  "Exam",
  "Deployment",
  "Interview",
  "Other"
]

export default function FailureModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState(CATEGORIES[0])
  const [reason, setReason] = useState("")       // ✅ NEW
  const [lesson, setLesson] = useState("")
  const [retry, setRetry] = useState(true)

  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!modalRef.current) return

    animate(modalRef.current, {
      scale: [0.8, 1],
      opacity: [0, 1],
      duration: 300,
      easing: "ease-out"
    })
  }, [])

  const handleClose = () => {
    if (!modalRef.current) return

    animate(modalRef.current, {
      scale: [1, 0.9],
      opacity: [1, 0],
      duration: 200,
      easing: "ease-in",
      complete: onClose
    })
  }

  const shakeModal = () => {
    if (!modalRef.current) return

    animate(modalRef.current, {
      translateX: [
        { value: -10, duration: 50 },
        { value: 10, duration: 50 },
        { value: -8, duration: 50 },
        { value: 8, duration: 50 },
        { value: 0, duration: 50 }
      ],
      boxShadow: [
        "0 0 0px rgba(239,68,68,0)",
        "0 0 20px rgba(239,68,68,0.8)",
        "0 0 0px rgba(239,68,68,0)"
      ],
      easing: "ease-in-out"
    })
  }

  const handleSubmit = async () => {

    if (!title.trim() || !reason.trim()) {
      shakeModal()
      return
    }

    const newFailure = {
  id: uuid(),
  title,
  category,
  reason,
  lesson,
  retry,
  date: new Date().toISOString(),
}

saveFailure(newFailure)

const updatedFailures = JSON.parse(
  localStorage.getItem("failures") || "[]"
)

await runPatternCheck(updatedFailures)


handleClose()

  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center"
      onClick={handleClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-neutral-900 p-8 rounded-2xl w-96 border border-neutral-800 shadow-xl space-y-4"
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-neutral-400 hover:text-red-500 transition text-lg font-bold"
        >
          ✕
        </button>

        <input
          placeholder="Failure Title"
          className="w-full p-2 bg-neutral-800 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="w-full p-2 bg-neutral-800 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        {/* ✅ Reason for Failure */}
        <textarea
          placeholder="Reason for Failure (What went wrong?)"
          className="w-full p-2 bg-neutral-800 rounded"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />

        <textarea
          placeholder="What did you learn?"
          className="w-full p-2 bg-neutral-800 rounded"
          value={lesson}
          onChange={(e) => setLesson(e.target.value)}
        />

        <div className="flex items-center justify-between bg-neutral-800 p-3 rounded">
          <span className="text-sm text-neutral-300">
            Would You Retry?
          </span>

          <button
            onClick={() => setRetry(!retry)}
            className={`px-4 py-1 rounded-full text-sm font-semibold transition-all ${
              retry
                ? "bg-green-600 text-white shadow-[0_0_10px_rgba(34,197,94,0.7)]"
                : "bg-red-600 text-white shadow-[0_0_10px_rgba(239,68,68,0.7)]"
            }`}
          >
            {retry ? "Yes" : "No"}
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-red-600 hover:bg-red-700 p-2 rounded font-bold transition-all"
        >
          Log Failure
        </button>
      </div>
    </div>
  )
}
