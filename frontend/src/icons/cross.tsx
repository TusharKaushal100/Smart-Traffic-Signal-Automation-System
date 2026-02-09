import { defaultStyle, iconSizeClass, type IconProps } from "./iconsProps";


export const Cross = (props:IconProps)=>{
      return <div onClick = {props.onClick}>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={`${iconSizeClass[props.size]} ${defaultStyle} `}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
      </div>

}