
export interface IconProps{

       size:"sm"|"md"|"lg",
       onClick?:()=>void
    
}

export const iconSizeClass = {
      sm:"size-4",
      md:"size-6",
      lg:"size-8"
}

export const defaultStyle = "hover:bg-gray-300 transition-all duration-500 rounded-md"