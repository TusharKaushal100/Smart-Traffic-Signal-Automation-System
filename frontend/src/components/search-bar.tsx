interface SearchProps{
  search:string
  setSearch:(value:string)=>void
}

export const SearchBar = ({search,setSearch}:SearchProps)=>{

  return(

    <div className="flex justify-between items-center mb-6">

      <input
        className="w-96 p-3 rounded-md border border-slate-300"
        placeholder="Search intersection..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
      />

    </div>

  )

}