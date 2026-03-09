import { useState } from "react"
import axios from "axios"
import { EditIntersectionModal } from "./EditIntersectionModal"

interface CardProps{
  data:any
  setMonitorIntersection:(i:any)=>void
  setEditing:(v:boolean)=>void
  refreshData:()=>void
}

export const IntersectionCard = ({data,setMonitorIntersection,setEditing,refreshData}:CardProps)=>{

  const [menuOpen,setMenuOpen] = useState(false)
  const [editOpen,setEditOpen] = useState(false)

  const resumeAuto = async()=>{

    try{

      const token = localStorage.getItem("token")

      await axios.put(
        "http://localhost:5000/api/v1/intersection/auto",
        {
          intersectionId:data._id
        },
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )

      alert("Auto traffic resumed")

      refreshData()

    }catch(err){

      console.log("resume auto failed")

    }

  }

  return(

    <div className="bg-white rounded-xl shadow-lg p-6 w-full hover:shadow-2xl">

      <div className="flex justify-between items-center mb-3">

        <div>

          <div className="text-2xl font-semibold">
            {data.name}
          </div>

          <div className="text-sm text-gray-500">
            {data.location}
          </div>

        </div>

        <div className="flex gap-3 items-center">

          <button
            onClick={resumeAuto}
            className="bg-green-600 text-white px-3 py-1 rounded-md text-sm"
          >
            Resume Auto
          </button>

          <div className="relative">

            <button
              onClick={()=>setMenuOpen(!menuOpen)}
              className="text-xl"
            >
              ⋮
            </button>

            {menuOpen &&(

              <div className="absolute right-0 bg-white border shadow-lg rounded-md w-32">

                <button
                  onClick={()=>{
                    setMonitorIntersection(data)
                    setMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                >
                  Monitor
                </button>

                <button
                  onClick={()=>{
                    setEditing(true)
                    setEditOpen(true)
                    setMenuOpen(false)
                  }}
                  className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                >
                  Edit
                </button>

              </div>

            )}

          </div>

        </div>

      </div>

      <div className="grid grid-cols-4 gap-4 mt-4">

        {data.signals.map((signal:any)=>(

          <div
            key={signal.laneId}
            className="border p-4 rounded-lg bg-gray-50 hover:shadow-md transition"
          >

            <div className="flex justify-between mb-2">
              <span className="font-semibold">
                Lane {signal.laneId}
              </span>
            </div>

            <div className="flex items-center gap-3 mb-3">

              <div className="flex flex-col gap-1">

                <div className={`w-3 h-3 rounded-full ${
                  signal.currentState === "RED"
                    ? "bg-red-500 animate-pulse"
                    : "bg-gray-300"
                }`} />

                <div className={`w-3 h-3 rounded-full ${
                  signal.currentState === "YELLOW"
                    ? "bg-yellow-400 animate-pulse"
                    : "bg-gray-300"
                }`} />

                <div className={`w-3 h-3 rounded-full ${
                  signal.currentState === "GREEN"
                    ? "bg-green-500 animate-pulse"
                    : "bg-gray-300"
                }`} />

              </div>

              <span className="font-semibold">
                {signal.currentState}
              </span>

            </div>

            <div className="text-sm mb-2">
              Vehicles: {signal.vehicleCount}
            </div>

            <div>

              <div className="text-sm mb-1">
                Density
              </div>

              <div className="w-full bg-gray-200 h-2 rounded">

                <div
                  className={`h-2 rounded ${
                    signal.density === "LOW"
                      ? "bg-green-500 w-1/3"
                      : signal.density === "MEDIUM"
                      ? "bg-yellow-400 w-2/3"
                      : "bg-red-500 w-full"
                  }`}
                />

              </div>

            </div>

            <div className="text-center mt-3">

              <div className="text-xs text-gray-500">
                Remaining
              </div>

              <div className="text-2xl font-bold">
                {signal.remainingTime}s
              </div>

            </div>

          </div>

        ))}

      </div>

      <EditIntersectionModal
        close={editOpen}
        setClose={(v)=>{
          setEditOpen(v)
          if(!v) setEditing(false)
        }}
        intersection={data}
        onSaved={refreshData}
      />

    </div>

  )

}