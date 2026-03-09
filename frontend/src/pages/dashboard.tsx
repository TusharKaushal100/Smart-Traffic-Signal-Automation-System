import { SideBar } from "../components/sidebar"
import { SearchBar } from "../components/search-bar"
import { IntersectionList } from "../components/intersection-list"
import { AddIntersectionButton } from "../components/AddIntersectionButton"
import { AddIntersectionModal } from "../components/AddIntersectionModal"

import { useState } from "react"

export const Dashboard = () => {

  const [search,setSearch] = useState("")
  const [openModal,setOpenModal] = useState(false)

  return (

    <div className="flex h-screen bg-white-900">

      <SideBar/>

      <div className="flex-1 p-6 overflow-y-auto">

        {/* Search bar + add button */}
        <div className="flex justify-between items-center mb-6">

          <SearchBar search={search} setSearch={setSearch}/>

          <AddIntersectionButton onClick={()=>setOpenModal(true)}/>

        </div>

        <IntersectionList search={search}/>

      </div>

      <AddIntersectionModal close={openModal} setClose={setOpenModal}/>

    </div>

  )

}