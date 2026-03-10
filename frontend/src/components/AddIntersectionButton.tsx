interface Props{
  onClick:()=>void
}

export const AddIntersectionButton = ({onClick}:Props)=>{

  return(

    <button
      onClick={onClick}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
    >
      + Add Intersection
    </button>

  )

}