import axios from "axios"
import { useEffect,useState } from "react"
import { IntersectionCard } from "./intersection-card"

interface Props{
  search:string
}

export const IntersectionList = ({search}:Props)=>{

  const [intersections,setIntersections] = useState<any[]>([])

  useEffect(()=>{

    const fetchIntersections = async ()=>{

      const res = await axios.get(
        "http://localhost:5000/api/v1/intersection/list"
      )

      setIntersections(res.data)

    }

    fetchIntersections()

  },[])


  const filtered = intersections.filter((i)=>
      i.name.toLowerCase().includes(search.toLowerCase())
  )


  return(

    <div className="flex flex-col gap-6 w-full">

      {filtered.map((i)=>(
        <IntersectionCard key={i._id} data={i}/>
      ))}

    </div>

  )

}