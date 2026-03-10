import { useEffect, useRef, useState } from "react"
import axios from "axios"
import { EditIntersectionModal } from "./EditIntersectionModal"
import { IntersectionVisualizer } from "./IntersectionVisualizer"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

interface Props {
  intersection: any
  exitMonitor: () => void
  onIntersectionUpdated: () => void
}

export const MonitorView = ({ intersection, exitMonitor, onIntersectionUpdated }: Props) => {

  const [signals, setSignals] = useState(intersection.signals)
  const [editOpen, setEditOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Show roadmap animation for at least 2 seconds on entering monitor
    const timer = setTimeout(() => setLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080")
    ws.onmessage = (e) => {
      const data = JSON.parse(e.data)
      const fresh = data.find((i: any) => i._id === intersection._id)
      if (fresh) setSignals(fresh.signals)
    }
    return () => ws.close()
  }, [intersection._id])

  const resumeAuto = async () => {
    try {
      const token = localStorage.getItem("token")
      await axios.put(
        "http://localhost:5000/api/v1/intersection/auto",
        { intersectionId: intersection._id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      onIntersectionUpdated()
    } catch (err) {
      console.log("failed to resume auto traffic")
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-64 h-64">
          <DotLottieReact src="/animations/Roadmap.lottie" loop autoplay />
        </div>
        <p className="text-slate-500 text-sm mt-2 animate-pulse tracking-widest uppercase">
          Loading monitor...
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          Monitoring: {intersection.name}
        </h2>
        <div className="flex gap-3">
          <button onClick={() => setEditOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md">
            Edit
          </button>
          <button onClick={resumeAuto} className="bg-green-600 text-white px-4 py-2 rounded-md">
            Resume Auto Traffic
          </button>
          <button onClick={exitMonitor} className="bg-gray-200 px-4 py-2 rounded-md">
            Back
          </button>
        </div>
      </div>

      <IntersectionVisualizer signals={signals} />

      <EditIntersectionModal
        isOpen={editOpen}
        setIsOpen={setEditOpen}
        intersection={intersection}
        onSaved={() => {
          setEditOpen(false)
          onIntersectionUpdated()
        }}
      />
    </div>
  )
}