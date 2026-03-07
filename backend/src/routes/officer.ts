import express from "express"
import type { Response } from "express"

import { auth} from "../middlewares/auth.js"
import type { AuthRequest } from "../middlewares/auth.js"
import { IntersectionModel } from "../db.js"

export const overrideRouter = express.Router()



const handleOverride = async (req:AuthRequest,res:Response)=>{

    console.log("inside manual override")

    const {intersectionId,laneId,state,time} = req.body


    if(!intersectionId || !laneId || !state || !time){

        return res.status(400).json({message:"intersectionId, laneId and state,time are required"})
    }

    const validStates = ["RED","GREEN","YELLOW"]

     if(!validStates.includes(state)){
        return res.status(400).json({message:"Invalid signal state"})
     }


    try{

        const intersection = await IntersectionModel.findById(intersectionId)

        if(!intersection){

            return res.status(404).json({message:"Intersection not found"})
        }


        const signal = intersection.signals.find(s => s.laneId === laneId)

        if(!signal){

            return res.status(404).json({message:"Signal not found"})
        }


        signal.currentState = state
        signal.remainingTime = time

        await intersection.save()


        return res.json({

            message:"Manual override activated",
            intersectionId,
            laneId,
            newState:state

        })

    }
    catch(err){

        console.log("error in manual override")

        return res.status(500).json({message:"Server error"})
    }

}



//@ts-ignore
overrideRouter.put("/override",auth,handleOverride)