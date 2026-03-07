import axios from "axios"
import FormData from "form-data"
import { ML_API } from "../config.js"

export const analyzeTraffic = async (imageBuffer: Buffer) => {

    const form = new FormData()

    form.append("file", imageBuffer, {
        filename: "lane.jpg",
        contentType: "image/jpeg"
    })

    const response = await axios.post(
        `${ML_API}/analyze`,
        form,
        {
            headers: form.getHeaders()
        }
    )

    return response.data
}