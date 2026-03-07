import express from "express"
import { analyzeTraffic } from "../services/mlService.js"
import { calculateDensity, calculateGreenTime } from "../services/logic.js"
import { runTrafficScheduler } from "../services/scheduler.js"
import { IntersectionModel, SignalModel } from "../db.js"
import { upload } from "../middlewares/upload.js"

export const trafficRouter = express.Router()

const traffic = async (req: any, res: any) => {

    const { intersectionId } = req.body

    const images = req.files as Express.Multer.File[]

    const laneIds = Array.isArray(req.body.laneIds)
        ? req.body.laneIds
        : [req.body.laneIds]

    if (!intersectionId || !images || !laneIds) {
        return res.status(400).json({ message: "intersectionId, laneIds and images are required" })
    }

    try {

        const intersection = await IntersectionModel.findById(intersectionId)

        if (!intersection) {
            return res.status(404).json({ message: "Intersection not found" })
        }

        let totalVehicles = 0

        const laneResults: any[] = []

        for (let i = 0; i < images.length; i++) {

            const file = images[i]

            const laneId = laneIds[i]

            if (!file) continue

            const result = await analyzeTraffic(file.buffer)

            const vehicleCount = result.vehicle_count

            const density = calculateDensity(vehicleCount)

            const greenTime = calculateGreenTime(density)

            totalVehicles += vehicleCount

            const signal = intersection.signals.find((s: any) => s.laneId === laneId)

            if (signal) {
                signal.vehicleCount = vehicleCount
                signal.density = density
                signal.greenTime = greenTime
                signal.remainingTime = greenTime
            }

            laneResults.push({
                laneId,
                vehicleCount,
                density,
                greenTime
            })
        }

        await intersection.save()

        await runTrafficScheduler(intersectionId)

        const log = await SignalModel.create({
            intersectionId,
            density: calculateDensity(totalVehicles),
            vehicleCount: totalVehicles,
            greenTime: Math.max(...laneResults.map(l => l.greenTime))
        })

        return res.json({
            message: "Traffic analyzed successfully",
            intersectionId,
            lanes: laneResults,
            totalVehicles,
            log
        })

    } catch (err) {

        return res.status(500).json({ message: "Server error" })
    }
}

trafficRouter.post("/analyze", upload.array("images"), traffic)