import express from "express"
import {analyzeTraffic} from "../services/mlService.js"
import {calculateDensity,calculateGreenTime} from "../services/logic.js"
import {SignalModel} from "../db.js"

export const trafficRouter = express.Router()


trafficRouter.post("/analyze",async(req,res)=>{

    const {image,intersection} = req.body

    const result = await analyzeTraffic(image)

    const density = calculateDensity(result.vehicle_count)

    const greenTime = calculateGreenTime(density)

    const log = new SignalModel({

        intersection,
        density,
        vehicleCount:result.vehicle_count,
        greenTime

    })

    await log.save()

    res.json({

        vehicleCount:result.vehicle_count,
        density,
        greenTime

    })

})