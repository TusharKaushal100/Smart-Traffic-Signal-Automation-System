interface Props{
  state:string
}

export const TrafficLight = ({state}:Props)=>{

  return(

    <div className="flex flex-col gap-2 items-center">

      <div
        className={`w-6 h-6 rounded-full ${
          state==="RED" ? "bg-red-600 animate-pulse" : "bg-gray-300"
        }`}
      />

      <div
        className={`w-6 h-6 rounded-full ${
          state==="YELLOW" ? "bg-yellow-400 animate-pulse" : "bg-gray-300"
        }`}
      />

      <div
        className={`w-6 h-6 rounded-full ${
          state==="GREEN" ? "bg-green-500 animate-pulse" : "bg-gray-300"
        }`}
      />

    </div>

  )

}