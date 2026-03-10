import type { ReactElement } from "react"

interface Answer{
   content:string,
   name:string,
   icon?:ReactElement,
   image?:string
}

export const AnswerCard = (props :Answer)=>{

      return <div className = "bg-white rounded-lg w-full border-slate-500 shadow-lg m-1 transition-transform duration-300 ease-out hover:scale-[1.03]">

        <div className="flex  items-center">
              <div className= "p-3">
                
               <img src = {props.image} className = "w-9 h-9 rounded-full"></img>
              </div>
              <div className= "font-bold">
                   {props.name}
              </div>
              
        </div>
        <div className = "pl-5">
            {props.content}
        </div>

      </div>
}