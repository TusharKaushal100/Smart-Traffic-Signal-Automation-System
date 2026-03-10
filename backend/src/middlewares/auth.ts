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
   
    
    

    try{
        const token = req.headers.authorization?.split(" ")[1]

        if(!token){ 
            return res.status(401).json({message:"Token error"})
        }    

        const decoded = jwt.verify(token as string,Secret) as jwtPayload

        req.userid = decoded.id
        
        console.log("succesfully Authenticated user id:",req.userid)
        next()

    }
    catch(err){

        return res.status(401).json({message:"Unauthorized"})
    }

}