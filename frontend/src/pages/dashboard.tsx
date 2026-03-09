import { SideBar } from "../components/sidebar"
import { SearchBar } from "../components/search-bar"
import { IntersectionList } from "../components/intersection-list"
import { MonitorView } from "../components/monitor-view"
import { useState } from "react"
import { AddIntersectionModal } from "../components/AddIntersectionModal"

export const Dashboard = () => {

  const [search,setSearch] = useState("")
  const [showIntersections,setShowIntersections] = useState(false)

  const [monitorIntersection,setMonitorIntersection] = useState<any>(null)

  const [openModal,setOpenModal] = useState(false)

  return (

    <div className="flex h-screen bg-white">

      <SideBar setShowIntersections={setShowIntersections}/>

      <div className="flex-1 p-6 overflow-y-auto">

        {/* MONITOR MODE */}

        {monitorIntersection && (

          <MonitorView
            intersection={monitorIntersection}
            exitMonitor={()=>setMonitorIntersection(null)}
          />

        )}

        {/* LIST MODE */}

        {!monitorIntersection && showIntersections && (

          <>

            <div className="flex justify-between mb-4">

              <SearchBar search={search} setSearch={setSearch}/>

              <button
                onClick={()=>setOpenModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                + Add Intersection
              </button>

            </div>

            <IntersectionList
              search={search}
              //@ts-ignore
              setMonitorIntersection={setMonitorIntersection}
            />

          </>

        )}

      </div>

      <AddIntersectionModal
        close={openModal}
        setClose={setOpenModal}
      />

    </div>

  )

}