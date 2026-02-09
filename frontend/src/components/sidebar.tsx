import { useState } from "react"
import { Plus } from "../icons/plus"

import { ProfileIcon } from "../icons/profile-icon"
import { SidebarItem } from "./sidebar-item"
import { Question } from "../icons/question"
import { Bars } from "../icons/sidebar"

const defaultStyle = "h-screen  bg-red shadow-lg border-slate-300"

export const SideBar = ()=>{
       
    const [open,setOpen] = useState(true)

    return <div  className = {`${defaultStyle} ${open?"w-72":"w-12"}  transition-all duration-300`}>
              
            <div>
                <div className="mb-4">
                     <SidebarItem  onClick={()=>{setOpen(!open)}}  icon={<Bars size= {"md"}></Bars>} text={""} open={open}></SidebarItem>
                </div>
                
                <SidebarItem  icon={<ProfileIcon size= {"md"}></ProfileIcon>} text={"Profile"} open={open}></SidebarItem>
                <SidebarItem  icon={<Question size= {"md"}></Question>} text={"Community Questions"} open={open}></SidebarItem>
                <SidebarItem  icon={<ProfileIcon size= {"md"}></ProfileIcon>} text={"Profile"} open={open}></SidebarItem>
                <SidebarItem  icon={<ProfileIcon size= {"md"}></ProfileIcon>} text={"Profile"} open={open}></SidebarItem>
                <SidebarItem  icon={<ProfileIcon size= {"md"}></ProfileIcon>} text={"Profile"} open={open}></SidebarItem>      
            </div>  
              
    </div>
}