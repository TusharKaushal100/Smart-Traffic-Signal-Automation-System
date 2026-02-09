
import type { IconProps } from "./iconsProps";  // interfaces can only be imported as type to make them distunguish from normal value imports
import { defaultStyle, iconSizeClass} from "./iconsProps"

export const Plus = (props:IconProps)=>{
        return <div onClick = {props.onClick}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className={`${iconSizeClass[props.size]} ${defaultStyle}`}>
  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
</svg>


        </div>
}