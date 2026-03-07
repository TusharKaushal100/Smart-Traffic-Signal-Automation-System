import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { updateSignalTimers } from "./services/scheduler.js"

import { officerRouter } from "./routes/officer.js"
import { trafficRouter } from "./routes/traffic.js"
import { violationRouter } from "./routes/violation.js"
import { IntersectionModel } from "./db.js"

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

        setInterval(async () => {

             console.log("updating signal timers")

             const intersections = await IntersectionModel.find()

            for (let i = 0; i < intersections.length; i++) {

                    await updateSignalTimers(intersections[i]!._id.toString())

            }

             },1000)

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