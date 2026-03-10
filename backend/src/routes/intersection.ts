import express from "express"
import type { Request, Response } from "express"
import { IntersectionModel } from "../db.js"
import { auth } from "../middlewares/auth.js"
import { runTrafficScheduler } from "../services/scheduler.js"
import type { AuthRequest } from "../middlewares/auth.js"

export const intersectionRouter = express.Router()

const createIntersection = async (req: AuthRequest, res: Response) => {
    const { name, location, signals } = req.body
    if (!name || !signals) {
        return res.status(400).json({ message: "name and signals required" })
    }
    try {
        const intersection = await IntersectionModel.create({ name, location, signals })
        return res.json({ message: "Intersection created", intersection })
    } catch (err) {
        return res.status(500).json({ message: "Error creating intersection" })
    }
}

const listIntersections = async (req: Request, res: Response) => {
    const intersections = await IntersectionModel.find()
    res.json(intersections)
}

const updateIntersection = async (req: AuthRequest, res: Response) => {
    const { intersectionId, signals } = req.body
    const intersection = await IntersectionModel.findById(intersectionId)
    if (!intersection) {
        return res.status(404).json({ message: "Intersection not found" })
    }
    for (let i = 0; i < signals.length; i++) {
        //@ts-ignore
        intersection.signals[i].currentState = signals[i].currentState
        //@ts-ignore
        intersection.signals[i].greenTime = signals[i].greenTime
        //@ts-ignore
        intersection.signals[i].yellowTime = signals[i].yellowTime
        //@ts-ignore
        if (signals[i].currentState === "GREEN") {
            //@ts-ignore
            intersection.signals[i].remainingTime = signals[i].greenTime
        } else if (signals[i].currentState === "YELLOW") {
            //@ts-ignore
            intersection.signals[i].remainingTime = signals[i].yellowTime
        } else {
            //@ts-ignore
            intersection.signals[i].remainingTime = 0
        }
        //@ts-ignore
        intersection.signals[i].manualOverride = true
    }
    await intersection.save()
    res.json({ message: "Updated" })
}

const resumeAutoTraffic = async (req: AuthRequest, res: Response) => {
    const { intersectionId } = req.body
    const intersection = await IntersectionModel.findById(intersectionId)
    if (!intersection) {
        return res.status(404).json({ message: "Intersection not found" })
    }
    for (const signal of intersection.signals) {
        //@ts-ignore
        signal.manualOverride = false
        signal.currentState = "RED"
        signal.remainingTime = 0
    }
    await intersection.save()
    await runTrafficScheduler(intersectionId)
    res.json({ message: "Auto traffic resumed" })
}

//@ts-ignore
intersectionRouter.post("/create", auth, createIntersection)
intersectionRouter.get("/list", listIntersections)
//@ts-ignore
intersectionRouter.put("/update", auth, updateIntersection)
//@ts-ignore
intersectionRouter.put("/auto", auth, resumeAutoTraffic)