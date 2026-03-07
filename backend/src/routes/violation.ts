import express from "express"
import {ViolationModel} from "../db.js"

export const violationRouter = express.Router()


violationRouter.post("/store",async(req,res)=>{

    const violation = new ViolationModel(req.body)

    await violation.save()

    res.json({message:"Violation stored"})

})


violationRouter.get("/all",async(req,res)=>{

    const data = await ViolationModel.find()

    res.json(data)

})