import express from "express"
import type { Request, Response } from "express"
import { IntersectionModel } from "../db.js"
import { auth } from "../middlewares/auth.js"

import type {AuthRequest} from "../middlewares/auth.js"

export const intersectionRouter = express.Router()

const createIntersection = async (req: AuthRequest, res: Response) => {

    console.log("inside create intersection")

    const { name, location, signals } = req.body

    if (!name || !signals) {
        return res.status(400).json({ message: "name and signals required" })
    }

    try {

        const intersection = await IntersectionModel.create({
            name,
            location,
            signals
        })

        return res.json({
            message: "Intersection created",
            intersection
        })

    } catch (err) {

        return res.status(500).json({ message: "Error creating intersection" })
    }

}

const listIntersections = async (req: Request, res: Response) => {

    const intersections = await IntersectionModel.find()

    res.json(intersections)

}

//@ts-ignore
intersectionRouter.post("/create",auth,createIntersection)

intersectionRouter.get("/list", listIntersections)