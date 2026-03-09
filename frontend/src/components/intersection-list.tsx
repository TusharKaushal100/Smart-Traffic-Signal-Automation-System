import axios from "axios"
import { useEffect,useState } from "react"
import { IntersectionCard } from "./intersection-card"

interface Props{
  search:string
  setMonitorIntersection:(i:any)=>void
}

export const IntersectionList = ({search,setMonitorIntersection}:Props)=>{

  const [intersections,setIntersections] = useState<any[]>([])
  const [editing,setEditing] = useState(false)

 
  const fetchIntersections = async()=>{

    try{

      const res = await axios.get(
        "http://localhost:5000/api/v1/intersection/list"
      )

      setIntersections(res.data)

    }catch(err){

      console.log("fetch intersections failed")

    }

  }

  useEffect(()=>{

    fetchIntersections()

  },[])

  useEffect(()=>{

    const ws = new WebSocket("ws://localhost:8080")

    ws.onopen = ()=>{
      console.log("websocket connected")
    }

    ws.onmessage = (e)=>{

      
      if(editing) return

      const data = JSON.parse(e.data)

      setIntersections(data)

    }

    ws.onerror = ()=>{
      console.log("websocket error")
    }

    return ()=>ws.close()

  },[editing])

  const filtered = intersections.filter((i)=>
    i.name.toLowerCase().includes(search.toLowerCase())
  )

  return(

    <div className="flex flex-col gap-6 w-full">

      {filtered.map((i)=>(

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