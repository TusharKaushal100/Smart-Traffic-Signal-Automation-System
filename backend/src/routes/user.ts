import express from 'express';
import type {Request, Response} from 'express';
import {z} from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {OfficerModel} from '../db.js';
import {Secret} from '../config.js';

export const officerRouter = express.Router();



const handleSignup = async (req:Request,res:Response)=>{

    console.log("inside officer signup")

    const {username,password} = req.body

    console.log("BODY:",req.body)

    if(!username || !password){

        return res.status(400).json({message:"All fields are required"})
    }


    const requiredFormat = z.object({

        username:z.string().min(3).max(20),

        password:z.string().min(6).max(15)

    })


    const parseResult = requiredFormat.safeParse({username,password})


    if(!parseResult.success){

        const fieldErrors = parseResult.error.flatten().fieldErrors

        return res.status(400).json({
            message:"Invalid input",
            errors:fieldErrors
        })
    }


    const checkOfficer = await OfficerModel.findOne({username})

    if(checkOfficer){

        return res.status(400).json({message:"Officer already exists"})
    }


    const hashedPassword = await bcrypt.hash(password,10)


    try{

        console.log("creating officer")

        await OfficerModel.create({

            username,
            password:hashedPassword

        })


        return res.json({message:"Officer created successfully"})


    }
    catch(err:any){

        console.log("error creating officer")

        console.error(err)

        return res.status(500).json({message:"Error registering officer"})
    }

}



const handleLogin = async (req:Request,res:Response)=>{

    console.log("inside officer login")

    const {username,password} = req.body


    if(!username || !password){

        return res.status(400).json({message:"All fields are required"})
    }


    const findOfficer = await OfficerModel.findOne({username})


    if(!findOfficer){

        return res.status(400).json({message:"Officer does not exist"})
    }


    const isPasswordValid = await bcrypt.compare(password,findOfficer.password)


    if(!isPasswordValid){

        return res.status(400).json({message:"Invalid password"})
    }


    const token = jwt.sign({id:findOfficer._id},Secret)


    return res.json({

        token:token,

        message:"Login successful"

    })

}



officerRouter.post("/signup",handleSignup)

officerRouter.post("/login",handleLogin)