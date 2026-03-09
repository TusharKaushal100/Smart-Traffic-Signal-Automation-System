import { useState } from "react"
import axios from "axios"

interface Props{
  close:boolean
  setClose:(v:boolean)=>void
}

interface Lane{
  laneId:string
  direction:string
  currentState:string
  density:string
  vehicleCount:number
  greenTime:number
  yellowTime:number
  remainingTime:number
}

export const AddIntersectionModal = ({close,setClose}:Props)=>{

  const [name,setName] = useState("")
  const [location,setLocation] = useState("")

  const [lanes,setLanes] = useState<Lane[]>([
    {
      laneId:"L1",
      direction:"",
      currentState:"RED",
      density:"LOW",
      vehicleCount:0,
      greenTime:20,
      yellowTime:5,
      remainingTime:0
    }
  ])

  const updateLane = (index:number,field:string,value:any)=>{

    const updated = [...lanes]

    //@ts-ignore
    updated[index][field] = value

    setLanes(updated)
  }

  const addLane = ()=>{

    setLanes([
      ...lanes,
      {
        laneId:`L${lanes.length+1}`,
        direction:"",
        currentState:"RED",
        density:"LOW",
        vehicleCount:0,
        greenTime:20,
        yellowTime:5,
        remainingTime:0
      }
    ])
  }

  const handleSubmit = async()=>{

    const token = localStorage.getItem("token")

    try{

      await axios.post(
        "http://localhost:5000/api/v1/intersection/create",
        {
          name,
          location,
          signals:lanes
        },
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )

      setClose(false)
      window.location.reload()

    }catch(err){
      console.log("Failed creating intersection")
    }
  }

  if(!close) return null

  return(

    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 z-50"
      onClick={()=>setClose(false)}
    >

      <div
        className="bg-white p-6 rounded-lg w-[600px] max-h-[85vh] overflow-y-auto shadow-xl"
        onClick={(e)=>e.stopPropagation()}
      >

        <h2 className="text-xl mb-4 font-semibold">Add Intersection</h2>

        {/* Intersection info */}

        <input
          placeholder="Intersection Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          className="border p-2 rounded-md w-full mb-3"
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e)=>setLocation(e.target.value)}
          className="border p-2 rounded-md w-full mb-4"
        />

        <div className="font-semibold mb-2">Signals</div>

        {lanes.map((lane,index)=>(

          <div
            key={index}
            className="border rounded-md p-3 mb-4"
          >

            <div className="grid grid-cols-2 gap-3">

              <div>
                <label className="text-xs text-gray-500">Lane ID</label>
                <input
                  value={lane.laneId}
                  onChange={(e)=>updateLane(index,"laneId",e.target.value)}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Direction</label>
                <input
                  value={lane.direction}
                  onChange={(e)=>updateLane(index,"direction",e.target.value)}
                  placeholder="north / south / east / west"
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Signal State</label>
                <select
                  value={lane.currentState}
                  onChange={(e)=>updateLane(index,"currentState",e.target.value)}
                  className="border p-2 rounded-md w-full"
                >
                  <option value="RED">RED</option>
                  <option value="GREEN">GREEN</option>
                  <option value="YELLOW">YELLOW</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500">Traffic Density</label>
                <select
                  value={lane.density}
                  onChange={(e)=>updateLane(index,"density",e.target.value)}
                  className="border p-2 rounded-md w-full"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500">Vehicle Count</label>
                <input
                  type="number"
                  value={lane.vehicleCount}
                  onChange={(e)=>updateLane(index,"vehicleCount",Number(e.target.value))}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Green Time (seconds)</label>
                <input
                  type="number"
                  value={lane.greenTime}
                  onChange={(e)=>updateLane(index,"greenTime",Number(e.target.value))}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Yellow Time (seconds)</label>
                <input
                  type="number"
                  value={lane.yellowTime}
                  onChange={(e)=>updateLane(index,"yellowTime",Number(e.target.value))}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Initial Remaining Time</label>
                <input
                  type="number"
                  value={lane.remainingTime}
                  onChange={(e)=>updateLane(index,"remainingTime",Number(e.target.value))}
                  className="border p-2 rounded-md w-full"
                />
              </div>

            </div>

          </div>

        ))}

        <button
          onClick={addLane}
          className="text-blue-600 mb-4"
        >
          + Add Lane
        </button>

        <div className="flex justify-end">

          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Create
          </button>

        </div>

      </div>

    </div>

  )

}