import type { ReactElement } from "react"

interface Question{
      title:string,
      description:string,
      tags?:string[],
      image?:string,
      icon?:ReactElement

}

export const QuestionCard = (props:Question)=>{

       return <div className ="bg-white   rounded-lg border-slate-500 shadow-lg outline-none w-full transition-transform duration-300 ease-out
    hover:scale-[1.03] p-2 mb-1">
             
             <div className = "pl-2 flex items-center justify-between">
                  <div className="flex gap-2">
                      <div >
                         {props.icon}
                      </div>
                  
                      <div className= "font-bold">
                          {props.title}
                      </div>
                  </div>
                 
                  <div className="p-3">
                       <img src = {props.image} className = "w-9 h-9 rounded-full"></img>
                 </div>
             </div>
             <div className="ml-3">
                  {props.description}
                  
             </div>
            
               
       </div>
}