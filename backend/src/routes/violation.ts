import express from "express"
import { ViolationModel } from "../db.js"

export const violationRouter = express.Router()


violationRouter.post("/store", async (req, res) => {

    try {

        const violation = await ViolationModel.create(req.body)

        res.json({
            message: "Violation stored",
            violation
        })

    } catch (err) {

        console.error(err)
        res.status(500).json({ message: "Failed to store violation" })

    }

})


violationRouter.get("/all", async (req, res) => {

    try {

        const data = await ViolationModel.find()

        res.json(data)

    } catch (err) {

        console.error(err)
        res.status(500).json({ message: "Failed to fetch violations" })

    }

})