import type {Request,Response,NextFunction} from "express"
import jwt from "jsonwebtoken"
import {Secret} from "../config.js"

export interface AuthRequest extends Request{
    userid:string
}

interface jwtPayload{
    id:string
}

export const auth = (req:AuthRequest,res:Response,next:NextFunction)=>{

    console.log("inside auth middleware")

    const token = req.headers.authorization

    if(!token){
        return res.status(401).json({message:"Unauthorized"})
    }

    try{

        const decoded = jwt.verify(token as string,Secret) as jwtPayload

        req.userid = decoded.id

        next()

    }
    catch(err){

        return res.status(401).json({message:"Unauthorized"})
    }

}