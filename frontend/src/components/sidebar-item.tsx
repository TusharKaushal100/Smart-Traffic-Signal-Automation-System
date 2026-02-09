import type { ReactElement } from "react"

interface Side{
    icon:ReactElement,
    text:string,
    open:boolean,
    onClick?:()=>void,
    special?:boolean
    

}

export const SidebarItem = (prop:Side)=>{
        
    return <div onClick = { prop.onClick} className = "flex items-center rounded-md hover:bg-gray-300 transition-all duration-300">
             <div className = "p-2">
                   {prop.icon}
             </div>
             <div className="p-1 text-md">
                 
                     {prop.open && prop.text}
                  
            
                  
             </div>
    </div>
}