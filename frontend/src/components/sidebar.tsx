import { useState } from "react"
import { ProfileIcon } from "../icons/profile-icon"
import { SidebarItem } from "./sidebar-item"
import { Question } from "../icons/question"
import { Bars } from "../icons/sidebar"

interface Props{
  setShowIntersections:(v:boolean)=>void
}

const defaultStyle = "h-screen bg-white shadow-lg border-slate-300"

export const SideBar = ({setShowIntersections}:Props)=>{

  const [open,setOpen] = useState(true)

  return (

    <div className={`${defaultStyle} ${open?"w-72":"w-12"} transition-all duration-300`}>

      <div>

        <div className="mb-4">
          <SidebarItem
            onClick={()=>setOpen(!open)}
            icon={<Bars size={"md"} />}
            text={""}
            open={open}
          />
        </div>

        <SidebarItem
          onClick={()=>setShowIntersections(true)}
          icon={<ProfileIcon size={"md"} />}
          text={"List Intersections"}
          open={open}
        />

        <SidebarItem
          icon={<Question size={"md"} />}
          text={"Community Questions"}
          open={open}
        />

        <SidebarItem
          icon={<ProfileIcon size={"md"} />}
          text={"Profile"}
          open={open}
        />

      </div>

    </div>

  )

}