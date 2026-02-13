"use client"

import { useEffect, useState } from "react"
import { getFailures, Failure } from "@/lib/storage"
import { animate } from "animejs"
import Link from "next/link"

export default function FailuresPage() {
  const [failures, setFailures] = useState<Failure[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedReason, setEditedReason] = useState("")
  const [editedLesson, setEditedLesson] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    setFailures(getFailures())
  }, [])

  useEffect(() => {
    animate(".failure-card", {
      translateY: [20, 0],
      opacity: [0, 1],
      delay: (_, i) => i * 70,
      duration: 400,
      easing: "ease-out"
    })
  }, [failures])

  const deleteFailure = (id: string) => {
    const updated = failures.filter((f) => f.id !== id)
    localStorage.setItem("failures", JSON.stringify(updated))
    setFailures(updated)
  }

  const startEditing = (failure: Failure) => {
    setEditingId(failure.id)
    setEditedReason(failure.reason || "")
    setEditedLesson(failure.lesson || "")
  }

  const saveEdit = (id: string) => {
    const updated = failures.map((f) =>
      f.id === id
        ? { ...f, reason: editedReason, lesson: editedLesson }
        : f
    )

    localStorage.setItem("failures", JSON.stringify(updated))
    setFailures(updated)
    setEditingId(null)
  }

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-red-500">
          Manage Failures
        </h1>

        <Link
          href="/"
          className="bg-neutral-800 px-4 py-2 rounded hover:bg-neutral-700 transition"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {failures.length === 0 && (
        <p className="text-neutral-500">
          No failures logged yet.
        </p>
      )}

      {/* Failure Cards */}
      <div className="space-y-6">
        {failures.map((f) => (
          <div
            key={f.id}
            className="failure-card bg-neutral-900 border border-neutral-800 p-6 rounded-xl"
          >
            {/* Top Row */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-lg text-white">
                {f.title}
              </h2>

              <span className="text-sm text-neutral-400">
                {new Date(f.date).toLocaleDateString()}
              </span>
            </div>

            {/* Badges */}
            <div className="flex gap-3 mb-4">
              <span className="text-xs bg-neutral-800 px-3 py-1 rounded-full">
                {f.category}
              </span>

              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  f.retry
                    ? "bg-green-600/20 text-green-400"
                    : "bg-red-600/20 text-red-400"
                }`}
              >
                {f.retry ? "Will Retry" : "Won’t Retry"}
              </span>
            </div>

            {/* EDIT MODE */}
            {editingId === f.id ? (
              <>
                <div className="mb-3">
                  <p className="text-sm text-red-400 font-semibold mb-1">
                    Reason:
                  </p>
                  <textarea
                    value={editedReason}
                    onChange={(e) => setEditedReason(e.target.value)}
                    className="w-full p-2 bg-neutral-800 rounded"
                  />
                </div>

                <div className="mb-4">
                  <p className="text-sm text-green-400 font-semibold mb-1">
                    Lesson:
                  </p>
                  <textarea
                    value={editedLesson}
                    onChange={(e) => setEditedLesson(e.target.value)}
                    className="w-full p-2 bg-neutral-800 rounded"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => saveEdit(f.id)}
                    className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-neutral-700 px-4 py-2 rounded hover:bg-neutral-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Reason */}
                {f.reason && (
                  <div className="mb-3">
                    <p className="text-sm text-red-400 font-semibold">
                      Reason:
                    </p>
                    <p className="text-neutral-400">
                      {f.reason}
                    </p>
                  </div>
                )}

                {/* Lesson */}
                {f.lesson && (
                  <div className="mb-4">
                    <p className="text-sm text-green-400 font-semibold">
                      Lesson:
                    </p>
                    <p className="text-neutral-400">
                      {f.lesson}
                    </p>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => startEditing(f)}
                    className="bg-yellow-600 px-4 py-2 rounded hover:bg-yellow-700 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => setDeleteId(f.id)}
                    className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* 🔥 DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl w-80 shadow-xl">
            <h3 className="text-lg font-bold mb-3 text-red-500">
              Confirm Deletion
            </h3>

            <p className="text-neutral-400 mb-6">
              Are you sure you want to delete this failure?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="bg-neutral-700 px-4 py-2 rounded hover:bg-neutral-600 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  deleteFailure(deleteId)
                  setDeleteId(null)
                }}
                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
