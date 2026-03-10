interface Props{
 density:string
}

export const DensityBar = ({density}:Props)=>{

 const width =
 density==="LOW"
 ? "30%"
 : density==="MEDIUM"
 ? "60%"
 : "100%"

 const color =
 density==="LOW"
 ? "bg-green-500"
 : density==="MEDIUM"
 ? "bg-yellow-500"
 : "bg-red-500"

 return(

  <div className="w-full bg-gray-200 h-2 rounded">

    <div
      style={{width}}
      className={`h-2 rounded ${color}`}
    />

  </div>

 )

}