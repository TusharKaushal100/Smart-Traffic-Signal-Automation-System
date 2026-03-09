import { useEffect, useState } from "react"
import axios from "axios"

interface Props{
  close:boolean
  setClose:(v:boolean)=>void
  intersection:any
  onSaved?:()=>void
}

export const EditIntersectionModal = ({close,setClose,intersection,onSaved}:Props)=>{

  const [signals,setSignals] = useState(intersection?.signals || [])

  useEffect(()=>{
    if(close){
      setSignals(intersection?.signals || [])
    }
  },[close,intersection])

  const updateSignal = (index:number,field:string,value:any)=>{

    const updated = [...signals]

    //@ts-ignore
    updated[index][field] = value

    setSignals(updated)
  }

  const handleSave = async()=>{

    const token = localStorage.getItem("token")

    if(!intersection?._id){
      console.error("missing intersection id")
      return
    }

    try{

      await axios.put(
        "http://localhost:5000/api/v1/intersection/update",
        {
          intersectionId:intersection._id,
          signals
        },
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )

      console.log("update success")

      setClose(false)

      
      if(onSaved){
        onSaved()
      }

    }catch(err){
      console.error("Update failed",err)
    }

  }

  if(!close) return null

  return(

    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={()=>setClose(false)}
    >

      <div
        className="bg-white w-[700px] max-h-[85vh] overflow-y-auto rounded-lg p-6 shadow-xl"
        onClick={(e)=>e.stopPropagation()}
      >

        <h2 className="text-xl font-semibold mb-4">
          Edit {intersection.name}
        </h2>

        {signals.map((signal:any,index:number)=>(

          <div
            key={signal.laneId}
            className="border rounded-lg p-4 mb-4"
          >

            <div className="grid grid-cols-2 gap-4">

              <div>
                <label className="text-xs text-gray-500">Lane</label>

                <input
                  value={signal.laneId}
                  disabled
                  className="border p-2 rounded-md w-full bg-gray-100"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Signal State</label>

                <select
                  value={signal.currentState}
                  onChange={(e)=>updateSignal(index,"currentState",e.target.value)}
                  className="border p-2 rounded-md w-full"
                >
                  <option value="RED">RED</option>
                  <option value="GREEN">GREEN</option>
                  <option value="YELLOW">YELLOW</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-500">
                  Green Time (seconds)
                </label>

                <input
                  type="number"
                  value={signal.greenTime}
                  onChange={(e)=>updateSignal(index,"greenTime",Number(e.target.value))}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">
                  Yellow Time (seconds)
                </label>

                <input
                  type="number"
                  value={signal.yellowTime}
                  onChange={(e)=>updateSignal(index,"yellowTime",Number(e.target.value))}
                  className="border p-2 rounded-md w-full"
                />
              </div>

            </div>

          </div>

        ))}

        <div className="flex justify-end">

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>

        </div>

      </div>

    </div>

  )

}