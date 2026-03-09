import { useState,useEffect } from "react"
import axios from "axios"
import { EditIntersectionModal } from "./EditIntersectionModal"
import { IntersectionVisualizer } from "./IntersectionVisualizer"

interface Props{
  intersection:any
  exitMonitor:()=>void
}

export const MonitorView = ({intersection,exitMonitor}:Props)=>{

  const [signals,setSignals] = useState(intersection.signals)

  const [editOpen,setEditOpen] = useState(false)

  useEffect(()=>{

    setSignals(intersection.signals)

    const timer = setInterval(()=>{
      
      //@ts-ignore
      setSignals(prev =>
        prev.map((s:any)=>({

          ...s,

          remainingTime:
            s.remainingTime > 0
              ? s.remainingTime - 1
              : 0

        }))
      )

    },1000)

    return ()=>clearInterval(timer)

  },[intersection])



  const resumeAuto = async()=>{

    try{

      const token = localStorage.getItem("token")

      await axios.put(
        "http://localhost:5000/api/v1/intersection/auto",
        {
          intersectionId:intersection._id
        },
        {
          headers:{
            Authorization:`Bearer ${token}`
          }
        }
      )

      alert("Auto traffic resumed")

    }
    catch(err){

      console.log("failed to resume auto traffic")

    }

  }



  return(

    <div>

      <div className="flex justify-between mb-6">

        <h2 className="text-2xl font-semibold">
          Monitoring: {intersection.name}
        </h2>

        <div className="flex gap-3">

          <button
            onClick={()=>setEditOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Edit
          </button>


          <button
            onClick={resumeAuto}
            className="bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Resume Auto Traffic
          </button>


          <button
            onClick={exitMonitor}
            className="bg-gray-200 px-4 py-2 rounded-md"
          >
            Back
          </button>

        </div>

      </div>



     <IntersectionVisualizer intersection={intersection}/>



      <EditIntersectionModal
        close={editOpen}
        setClose={setEditOpen}
        intersection={intersection}
      />

    </div>

  )

}