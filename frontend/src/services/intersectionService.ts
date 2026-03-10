import axios from "axios"

const API = "http://localhost:5000/api/v1/intersection"

export const createIntersection = async(data:any)=>{

    const token = localStorage.getItem("token")

    const res = await axios.post(
        `${API}/create`,
        data,
        {
            headers:{
                Authorization:`Bearer ${token}`
            }
        }
    )

    return res.data
}