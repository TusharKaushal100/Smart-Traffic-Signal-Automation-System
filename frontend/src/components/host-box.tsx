// import { useState } from "react"
// import type { ReactElement } from "react"
// import { Button } from "./button"


// interface Host{
//      question:ReactElement,
//      answer:ReactElement[]
// }

// export const HostBox = (props:Host)=>{
       
//     const [open,setOpen] = useState(false)
//     const answers = props.answer

//    return <div className= "bg-white rounded-lg border-slate-800 shadow-lg w-full p-4 mt-2">
//          <div className = "flex gap-4 items-start ">
               
//                <div className = "w-full ">
//                      {props.question}
//                      <div className = "max-h-72 overflow-y-auto overflow-x-hidden">
//                      {open && <div className = "ml-6 mr-2 ">  {/*wrap this map inside the curly braces  */}
//                    {answers.map((answer,index) => {
//                                     return <div key = {index} >{answer}</div>
//                                  })
//                                 }             
//                            </div>}
//                      </div>      
//                </div>

//               <Button text = {!open?"Answers":"Close"} variant = {"primary"} size = {"lg"} onClick = {()=>{setOpen(!open)}} ></Button>

//          </div>
         
         
//    </div>
// }


import { useState } from "react"
import type { ReactElement } from "react"
import { Button } from "./button"

interface HostProps {
  question: ReactElement
  answers: ReactElement[]
}

export const HostBox = ({ question, answers }: HostProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white rounded-lg border border-slate-300 shadow-lg w-full p-4 mt-2">
      <div className="flex gap-4 items-start">
        
        {/* Question + Answers */}
        <div className="w-full">
          {/* Question */}
          <div className="font-medium text-slate-900">
            {question}
          </div>

          {/* Answers */}
          {open && (
            <div className="mt-3 ml-6 mr-2 max-h-72 overflow-y-auto overflow-x-hidden space-y-2">
              {answers.length > 0 ? (
                answers.map((answer, index) => (
                  <div key={index} className="text-slate-700">
                    {answer}
                  </div>
                ))
              ) : (
                <div className="text-sm text-slate-500">
                  No answers yet.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <Button
          text={open ? "Close" : "Answers"}
          variant="primary"
          size="lg"
          onClick={() => setOpen(prev => !prev)}
        />
      </div>
    </div>
  )
}
