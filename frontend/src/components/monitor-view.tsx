import { useEffect, useState } from "react"
import axios from "axios"
import { EditIntersectionModal } from "./EditIntersectionModal"
import { IntersectionVisualizer } from "./IntersectionVisualizer"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

interface Props {
  intersection: any
  exitMonitor: () => void
  onIntersectionUpdated: () => void
}

// Per lane: 2 photos with timestamps
interface LanePhotos {
  photo1: File | null
  photo2: File | null
}

export const MonitorView = ({ intersection, exitMonitor, onIntersectionUpdated }: Props) => {

  const [signals, setSignals] = useState(intersection.signals)
  const [editOpen, setEditOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  // 2 photos per lane
  const [lanePhotos, setLanePhotos] = useState<Record<string, LanePhotos>>({})
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeResult, setAnalyzeResult] = useState<any>(null)
  const [analyzeError, setAnalyzeError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)
  const [currentRound, setCurrentRound] = useState<1 | 2 | null>(null)

  useEffect(() => {
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

  const handlePhotoChange = (laneId: string, photoNum: 1 | 2, file: File | null) => {
    setLanePhotos(prev => ({
      ...prev,
      [laneId]: {
        ...prev[laneId],
        [`photo${photoNum}`]: file
      }
    }))
    setAnalyzeResult(null)
    setAnalyzeError(null)
  }

  // Send specific photo round to backend
  const sendPhotos = async (round: 1 | 2) => {
    const selectedLanes = intersection.signals.filter((s: any) => {
      const photos = lanePhotos[s.laneId]
      return photos && (round === 1 ? photos.photo1 : photos.photo2)
    })

    if (selectedLanes.length === 0) return

    const token = localStorage.getItem("token")
    const formData = new FormData()
    formData.append("intersectionId", intersection._id)

    selectedLanes.forEach((signal: any) => {
      const photos = lanePhotos[signal.laneId]
      const file = round === 1 ? photos.photo1 : photos.photo2
      if (file) {
        formData.append("images", file)
        formData.append("laneIds", signal.laneId)
      }
    })

    const res = await axios.post(
      "http://localhost:5000/api/v1/traffic/analyze",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      }
    )

    return res.data
  }

  const handleAnalyze = async () => {
    // Validate: har lane mein kam se kam photo1 honi chahiye
    const hasAnyPhoto = intersection.signals.some((s: any) => lanePhotos[s.laneId]?.photo1)
    if (!hasAnyPhoto) {
      setAnalyzeError("choose atleast 1 Photo ")
      return
    }

    setAnalyzing(true)
    setAnalyzeError(null)
    setAnalyzeResult(null)

    try {
      // Round 1 — Photo 1 analyze karo
      setCurrentRound(1)
      const result1 = await sendPhotos(1)
      setAnalyzeResult({ round: 1, data: result1 })
      onIntersectionUpdated()

      // Check karo koi photo2 hai?
      const hasPhoto2 = intersection.signals.some((s: any) => lanePhotos[s.laneId]?.photo2)

      if (hasPhoto2) {
        // 10 second countdown
        setCurrentRound(null)
        for (let i = 10; i > 0; i--) {
          setCountdown(i)
          await new Promise(res => setTimeout(res, 1000))
        }
        setCountdown(null)

        // Round 2 — Photo 2 analyze karo
        setCurrentRound(2)
        const result2 = await sendPhotos(2)
        setAnalyzeResult({ round: 2, data: result2 })
        onIntersectionUpdated()
        setCurrentRound(null)
      }

    } catch (err: any) {
      setAnalyzeError(err.response?.data?.message || "Analysis fail ho gaya")
    } finally {
      setAnalyzing(false)
      setCurrentRound(null)
      setCountdown(null)
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
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold">Monitoring: {intersection.name}</h2>
        <div className="flex gap-3">
          <button onClick={() => setEditOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-md">Edit</button>
          <button onClick={resumeAuto} className="bg-green-600 text-white px-4 py-2 rounded-md">Resume Auto Traffic</button>
          <button onClick={exitMonitor} className="bg-gray-200 px-4 py-2 rounded-md">Back</button>
        </div>
      </div>

      {/* Visualizer */}
      <IntersectionVisualizer signals={signals} />

      {/* Upload Section */}
      <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-6">

        <h3 className="text-lg font-semibold mb-1 text-slate-800">🚦 Traffic Analyze</h3>

        {/* Lane Cards */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {intersection.signals.map((signal: any) => {
            const photos = lanePhotos[signal.laneId] || { photo1: null, photo2: null }
            return (
              <div key={signal.laneId} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">

                {/* Lane header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-slate-700">Lane {signal.laneId}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    signal.currentState === "GREEN" ? "bg-green-100 text-green-700"
                    : signal.currentState === "YELLOW" ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                  }`}>{signal.currentState}</span>
                </div>

                {/* Photo 1 */}
                <div className="mb-3">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs font-semibold text-slate-600">📸 Photo 1</span>
                    <span className="text-xs text-slate-400">(Now)</span>
                  </div>
                  {photos.photo1 ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(photos.photo1)}
                        className="w-full h-20 object-cover rounded-lg border"
                      />
                      <button
                        onClick={() => handlePhotoChange(signal.laneId, 1, null)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                      >✕</button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-slate-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                      <span className="text-xl">📷</span>
                      <span className="text-xs text-slate-400">Choose Photo</span>
                      <input type="file" accept="image/jpeg,image/png" className="hidden"
                        onChange={(e) => handlePhotoChange(signal.laneId, 1, e.target.files?.[0] ?? null)} />
                    </label>
                  )}
                </div>

                {/* Photo 2 */}
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs font-semibold text-slate-600">📸 Photo 2</span>
                    <span className="text-xs text-slate-400">(After 10s)</span>
                  </div>
                  {photos.photo2 ? (
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(photos.photo2)}
                        className="w-full h-20 object-cover rounded-lg border"
                      />
                      <button
                        onClick={() => handlePhotoChange(signal.laneId, 2, null)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                      >✕</button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-20 border-2 border-dashed border-blue-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                      <span className="text-xl">📷</span>
                      <span className="text-xs text-slate-400">Choose Photo</span>
                      <input type="file" accept="image/jpeg,image/png" className="hidden"
                        onChange={(e) => handlePhotoChange(signal.laneId, 2, e.target.files?.[0] ?? null)} />
                    </label>
                  )}
                </div>

                <div className="text-xs text-slate-400 text-center mt-2">
                  Vehicles: <span className="font-semibold text-slate-600">{signal.vehicleCount}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Status bar */}
        {analyzing && (
          <div className="mt-5 flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            {currentRound === 1 && <span className="text-blue-700 font-medium">⏳ Round 1 — Photo 1 analyzing</span>}
            {countdown !== null && (
              <span className="text-blue-700 font-medium">
                ⏱ Photo 2 will analyze After <span className="text-2xl font-black">{countdown}</span> seconds ....
              </span>
            )}
            {currentRound === 2 && <span className="text-blue-700 font-medium">⏳ Round 2 — Photo 2 analyzing...</span>}
          </div>
        )}

        {/* Analyze button */}
        <div className="mt-5 flex items-center gap-4">
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className={`px-6 py-2.5 rounded-lg font-semibold text-white transition ${
              analyzing ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {analyzing ? "Analyzing..." : "🔍 Analyze Traffic"}
          </button>
          {analyzeError && <p className="text-red-500 text-sm">{analyzeError}</p>}
        </div>

        {/* Results */}
        {analyzeResult && (
          <div className="mt-5 bg-green-50 border border-green-200 rounded-xl p-4">
            <h4 className="font-semibold text-green-800 mb-3">
              ✅ Round {analyzeResult.round} Analysis Complete!
              {analyzeResult.round === 1 && <span className="text-sm font-normal text-slate-500 ml-2">(Photo 2 will automatically analyze after 10 seconds)</span>}
            </h4>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {analyzeResult.data?.lanes?.map((lane: any) => (
                <div key={lane.laneId} className="bg-white rounded-lg p-3 border border-green-100 shadow-sm">
                  <div className="font-semibold text-slate-700 mb-1">Lane {lane.laneId}</div>
                  <div className="text-sm">🚗 Vehicles: <span className="font-bold">{lane.vehicleCount}</span></div>
                  <div className="text-sm">📊 Density: <span className={`font-bold ${
                    lane.density === "HIGH" ? "text-red-500"
                    : lane.density === "MEDIUM" ? "text-yellow-500"
                    : "text-green-500"
                  }`}>{lane.density}</span></div>
                  <div className="text-sm">⏱ Green: <span className="font-bold">{lane.greenTime}s</span></div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-sm text-slate-600">
              Total Vehicles: <span className="font-bold">{analyzeResult.data?.totalVehicles}</span>
            </div>
          </div>
        )}
      </div>

      <EditIntersectionModal
        isOpen={editOpen}
        setIsOpen={setEditOpen}
        intersection={intersection}
        onSaved={() => { setEditOpen(false); onIntersectionUpdated() }}
      />
    </div>
  )
}
