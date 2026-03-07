export const calculateDensity = (count:number)=>{

    if(count < 10) return "LOW"

    if(count < 20) return "MEDIUM"

    return "HIGH"

}


export const calculateGreenTime = (density:string)=>{

    if(density === "LOW") return 15

    if(density === "MEDIUM") return 30

    return 50

}