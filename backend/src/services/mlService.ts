import axios from "axios"
import {ML_API} from "../config.js"

export const analyzeTraffic = async(image:string)=>{

    const response = await axios.post(`${ML_API}/analyze`,{
        image
    })

    return response.data
}