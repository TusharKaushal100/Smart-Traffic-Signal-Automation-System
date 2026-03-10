import type { ReactElement } from "react"

interface ButtonProps{
       variant:"primary"|"secondary",
       size:"sm"|"md"|"lg",
       startIcon?:ReactElement,
       endIcon?:ReactElement,
       text:string
       onClick ?: ()=>void,
       className?:string
}

const buttonSizeClass = {
         sm:"px-1 py-1 text-sm",
         md:"px-2 py-1 text-md",
         lg:"px-4 py-1 text-lg"
}

const variantClass = {
  primary: "bg-yellow-400 text-slate-900 outline-none rounded-md font-bold hover:bg-yellow-300 transition-colors duration-200",
  secondary: "bg-slate-700 text-white outline-none rounded-md hover:bg-slate-600 transition-colors duration-200"
}

const defaultStyle = "hover:px-4 hover:py-1 hover:bg-black hover:text-white duration-300 transition-all"

export const Button = (props:ButtonProps)=>{
    

    return <button onClick = {props.onClick} className = {`${buttonSizeClass[props.size]} ${variantClass[props.variant]} ${defaultStyle} ${props.className}`}>
               <div className = "flex items-center justify-center ">
                     {props.startIcon?props.startIcon:null}
                     <div className = "pr-1 pl-1">
                              {props.text}
                     </div>
                    
                      {props.endIcon?props.endIcon:null}
               </div>
               
    </button>
}