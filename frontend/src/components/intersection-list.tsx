import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { IntersectionCard } from "./intersection-card"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

interface Props {
  search: string
  setMonitorIntersection: (i: any) => void
}

export const IntersectionList = ({ search, setMonitorIntersection }: Props) => {

  const [intersections, setIntersections] = useState<any[]>([])
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const editingRef = useRef(editing)

  useEffect(() => {
    editingRef.current = editing
  }, [editing])

  const fetchIntersections = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/v1/intersection/list")
      setIntersections(res.data)
    } catch (err) {
      console.log("fetch intersections failed")
    }
  }

  useEffect(() => {
    // Show roadmap animation for at least 2 seconds
    const minDelay = new Promise(res => setTimeout(res, 2000))
    const fetch = fetchIntersections()
    Promise.all([minDelay, fetch]).then(() => setLoading(false))
  }, [])

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080")
    ws.onopen = () => console.log("websocket connected")
    ws.onmessage = (e) => {
      if (editingRef.current) return
      const data = JSON.parse(e.data)
      setIntersections(data)
    }
    ws.onerror = () => console.log("websocket error")
    return () => ws.close()
  }, [])

  const filtered = intersections.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-64 h-64">
          <DotLottieReact src="/animations/Roadmap.lottie" loop autoplay />
        </div>
        <p className="text-slate-500 text-sm mt-2 animate-pulse tracking-widest uppercase">
          Loading intersections...
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {filtered.map((i) => (
        <IntersectionCard
          key={i._id}
          data={i}
          setMonitorIntersection={setMonitorIntersection}
          setEditing={setEditing}
          refreshData={fetchIntersections}
        />
      ))}
    </div>
  )
}