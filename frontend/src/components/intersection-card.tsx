interface CardProps{
  data:any
}

export const IntersectionCard = ({data}:CardProps)=>{

  return(

    <div className="bg-white rounded-xl shadow-lg p-6 w-full transition-all duration-300 hover:shadow-2xl">

      <div className="text-2xl font-semibold mb-1">
        {data.name}
      </div>

      <div className="text-sm text-gray-500 mb-6">
        {data.location}
      </div>

      <div className="grid grid-cols-4 gap-4 w-full">

        {data.signals.map((signal:any)=>(
          
          <div
            key={signal.laneId}
            className="border p-4 rounded-lg bg-gray-50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer"
          >

            <div className="flex justify-between mb-1">
              <span className="font-medium">Lane</span>
              <span>{signal.laneId}</span>
            </div>

            <div className="flex justify-between mb-1">
              <span className="font-medium">Vehicles</span>
              <span>{signal.vehicleCount}</span>
            </div>

            <div className="flex justify-between mb-1">
              <span className="font-medium">Density</span>
              <span>{signal.density}</span>
            </div>

            <div className="flex justify-between mb-1">
              <span className="font-medium">Status</span>
              <span
                className={
                  signal.currentState === "GREEN"
                    ? "text-green-600 font-semibold"
                    : signal.currentState === "RED"
                    ? "text-red-600 font-semibold"
                    : "text-yellow-500 font-semibold"
                }
              >
                {signal.currentState}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-medium">Remaining</span>
              <span>{signal.remainingTime}s</span>
            </div>

          </div>

        ))}

      </div>

    </div>

  )

}