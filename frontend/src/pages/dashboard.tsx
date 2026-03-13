import { SideBar } from "../components/sidebar"
import { SearchBar } from "../components/search-bar"
import { IntersectionList } from "../components/intersection-list"
import { MonitorView } from "../components/monitor-view"
import { useState, useCallback } from "react"
import { AddIntersectionModal } from "../components/AddIntersectionModal"
import axios from "axios"

export const Dashboard = () => {

  const [search, setSearch] = useState("")
  const [showIntersections, setShowIntersections] = useState(false)
  const [monitorIntersection, setMonitorIntersection] = useState<any>(null)
  const [openModal, setOpenModal] = useState(false)

  // FIX: when monitor saves/resumes, re-fetch the intersection and update
  //      monitorIntersection so MonitorView gets fresh data (new greenTime etc.)
  //yes changed code is getting pushed
  const refreshMonitorIntersection = useCallback(async () => {
    if (!monitorIntersection?._id) return
    try {
      const res = await axios.get("http://localhost:5000/api/v1/intersection/list")
      const fresh = res.data.find((i: any) => i._id === monitorIntersection._id)
      if (fresh) setMonitorIntersection(fresh)
    } catch (err) {
      console.log("failed to refresh monitor intersection")
    }
  }, [monitorIntersection])

  return (
    <div className="flex h-screen bg-white">

      <SideBar setShowIntersections={setShowIntersections} />

      <div className="flex-1 p-6 overflow-y-auto">

        {monitorIntersection && (
          <MonitorView
            intersection={monitorIntersection}
            exitMonitor={() => setMonitorIntersection(null)}
            onIntersectionUpdated={refreshMonitorIntersection}
          />
        )}

        {!monitorIntersection && showIntersections && (
          <>
            <div className="flex justify-between mb-4">
              <SearchBar search={search} setSearch={setSearch} />
              <button
                onClick={() => setOpenModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                + Add Intersection
              </button>
            </div>
            <IntersectionList
              search={search}
              setMonitorIntersection={setMonitorIntersection}
            />
          </>
        )}

      </div>

      <AddIntersectionModal close={openModal} setClose={setOpenModal} />

    </div>
  )
}
