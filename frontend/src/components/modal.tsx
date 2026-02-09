import { useRef } from "react"
import { Input } from "./input"
import { Button } from "./button"
import { Plus } from "../icons/plus"
import { Cross } from "../icons/cross"
import axios from "axios"
import { URL } from "../assets/config"

interface ModalData{
     onClick?:()=>void,
     title:string,
     description:string,
     tags?:string[],
     pressed:boolean,
     setPressed:any
}

export const Modal = (props:ModalData)=>{
         
     const titleRef = useRef<HTMLInputElement>(null)
     const descriptionRef = useRef<HTMLInputElement>(null)

     const handleModal = async ()=>{

          const token = localStorage.getItem("token")
          console.log(`token=${token}`)
               
          const title = titleRef.current?.value
          const description = descriptionRef.current?.value
       
          try{
              const response =  await axios.post(`${URL}/api/v1/question/ask`,{title,description},{headers:{authorization:`${token}`}})

              console.log(`response = ${response.data.message}`)
              
           }
           catch(err:any){
               console.log(`error caught:${err}`)
           }
          
     }

              return props.pressed ? <div className=" fixed flex items-center justify-center h-screen w-screen inset-0"> {/*so yeah if we dont used fixed then the profile div would come below this modal div so fixed is use to fix or glue it to the screen like a shield that stays in place so it appears on top of profile*/}
                       <div className=" fixed h-screen w-screen bg-white opacity-50 z-40" onClick = {props.onClick}>
                      {/* inset-0 shorthand for left-0 r-0 t-0 b-0*/}
                       </div>
                        <div className="hover:w-76 hover:h-76 duration-300 transition-all w-72 h-72  bg-white border-slate-300 z-50 shadow-lg rounded-md"> 
                             <div className="flex justify-end p-5">
                                  <Cross size={"md"} onClick={props.onClick}></Cross>
                             </div>
                             <div className = " flex items-center justify-center">
                                    <div>
                                    <Input ref = {titleRef} placeholder={"enter title"} ></Input> 
                                    <Input ref = {descriptionRef} placeholder={"enter description"} ></Input>
                                    <div className={"mt-6"}>
                                          <Button variant ={"primary"} text={"Submit"} size={"md"} className = {"w-full"} onClick={()=>{handleModal(); props.onClick?.();}}></Button> 
                                    </div>
                                    
                                    </div>
                              </div> 
                             
                               
                        </div>
                     
                  </div>:null
}