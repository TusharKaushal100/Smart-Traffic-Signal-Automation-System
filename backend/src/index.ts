import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"

import { officerRouter } from "./routes/officer.js"
import { trafficRouter } from "./routes/traffic.js"
import { violationRouter } from "./routes/violation.js"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000


app.get("/",(req,res)=>{
    res.send("Traffic Backend Running")
})


app.use("/api/v1/officer",officerRouter)
app.use("/api/v1/traffic",trafficRouter)
app.use("/api/v1/violation",violationRouter)



const main = async()=>{

    try{

        await mongoose.connect(process.env.MONGO_URL as string)

        console.log("MongoDB connected")

    }
    catch(err){

        console.log("MongoDB connection failed")

    }

    try{

        app.listen(PORT,()=>{
            console.log("Server running on "+PORT)
        })

    }
    catch(err){

        console.log("Server failed")

    }

}

main()