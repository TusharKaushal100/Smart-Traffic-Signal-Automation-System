import { useEffect,useState } from "react"

interface Props{
  intersection:any
}

export const IntersectionVisualizer = ({intersection}:Props)=>{

  const [signals,setSignals] = useState(intersection.signals)

  useEffect(()=>{

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

  },[])

  const getSignal = (lane:string)=>{
    return signals.find((s:any)=>s.laneId === lane)
  }

  const Light = ({state}:{state:string})=>{

    return(

      <div className="flex flex-col gap-1">

        <div className={`w-4 h-4 rounded-full ${
          state === "RED" ? "bg-red-500 animate-pulse" : "bg-gray-300"
        }`} />

        <div className={`w-4 h-4 rounded-full ${
          state === "YELLOW" ? "bg-yellow-400 animate-pulse" : "bg-gray-300"
        }`} />

        <div className={`w-4 h-4 rounded-full ${
          state === "GREEN" ? "bg-green-500 animate-pulse" : "bg-gray-300"
        }`} />

      </div>

    )

  }

  return(

    <div className="flex justify-center mt-10">

      <div className="relative w-[420px] h-[420px] bg-gray-100 rounded-lg">


        <div className="absolute top-[180px] left-[180px] w-[60px] h-[60px] bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
          🚦
        </div>

       

        <div className="absolute top-4 left-[190px] flex flex-col items-center">

          <Light state={getSignal("L1")?.currentState}/>

          <div className="text-sm mt-2">
            {getSignal("L1")?.remainingTime}s
          </div>

        </div>

        

        <div className="absolute right-4 top-[190px] flex items-center">

          <Light state={getSignal("L2")?.currentState}/>

          <div className="text-sm ml-2">
            {getSignal("L2")?.remainingTime}s
          </div>

        </div>

        

        <div className="absolute bottom-4 left-[190px] flex flex-col items-center">

          <Light state={getSignal("L3")?.currentState}/>

          <div className="text-sm mt-2">
            {getSignal("L3")?.remainingTime}s
          </div>

        </div>

      

        <div className="absolute left-4 top-[190px] flex items-center">

          <Light state={getSignal("L4")?.currentState}/>

          <div className="text-sm ml-2">
            {getSignal("L4")?.remainingTime}s
          </div>

        </div>

      </div>

    </div>

  )

}