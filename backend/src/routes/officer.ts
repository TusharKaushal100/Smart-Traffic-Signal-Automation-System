import express from "express"

export const officerRouter = express.Router()


officerRouter.post("/override",async(req,res)=>{

    const {intersection,signal} = req.body

    res.json({

        message:"Manual override activated",
        intersection,
        signal

    })

})