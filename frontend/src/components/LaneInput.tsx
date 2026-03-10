interface Props{
  lane:string
  setLane:(v:string)=>void
}

export const LaneInput = ({lane,setLane}:Props)=>{

  return(

    <input
      value={lane}
      onChange={(e)=>setLane(e.target.value)}
      placeholder="Lane ID"
      className="border p-2 rounded-md w-full"
    />

  )

}