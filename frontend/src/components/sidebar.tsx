import { useState } from "react"
import { ProfileIcon } from "../icons/profile-icon"
import { SidebarItem } from "./sidebar-item"
import { Question } from "../icons/question"
import { Bars } from "../icons/sidebar"
import { DotLottieReact } from "@lottiefiles/dotlottie-react"

interface Props {
  setShowIntersections: (v: boolean) => void
}

const defaultStyle = "h-screen bg-white shadow-lg border-slate-300 flex flex-col"

export const SideBar = ({ setShowIntersections }: Props) => {

  const [open, setOpen] = useState(true)

  return (
    <div className={`${defaultStyle} ${open ? "w-72" : "w-12"} transition-all duration-300`}>

      
      <div>
        <div className="mb-4">
          <SidebarItem
            onClick={() => setOpen(!open)}
            icon={<Bars size={"md"} />}
            text={""}
            open={open}
          />
        </div>

        <SidebarItem
          onClick={() => setShowIntersections(true)}
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

      
      {open && (
        <div className="mt-auto flex flex-col items-center pb-16 px-4">
          <div className="w-52 h-52">
            <DotLottieReact src="/animations/TrafficLight.lottie" loop autoplay />
          </div>
          <p className="text-xs text-gray-400 tracking-widest uppercase text-center mt-1">
            Traffic Monitor
          </p>
        </div>
      )}

     
      {!open && (
        <div className="mt-auto pb-4 flex justify-center">
          <div className="w-8 h-8">
            <DotLottieReact src="/animations/TrafficLight.lottie" loop autoplay />
          </div>
        </div>
      )}

    </div>
  )
}