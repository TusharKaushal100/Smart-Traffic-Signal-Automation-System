import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import { updateSignalTimers } from "./services/scheduler.js"

import { officerRouter } from "./routes/user.js"
import {overrideRouter} from "./routes/officer.js"
import { trafficRouter } from "./routes/traffic.js"
import { violationRouter } from "./routes/violation.js"
import { IntersectionModel } from "./db.js"
import { intersectionRouter } from "./routes/intersection.js"
import { startWebSocket } from "./ws.js"



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
app.use("/api/v1/intersection", intersectionRouter)
app.use("/api/v1/override", overrideRouter)
app.use("/uploads",express.static("uploads"))
app.use("/images",express.static("images"))
// app.use("/api/v1/user",)



const main = async()=>{

    try{

        await mongoose.connect(process.env.MONGO_URL as string)

        console.log("MongoDB connected")

        startWebSocket()

        setInterval(async () => {

            //  console.log("updating signal timers")

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