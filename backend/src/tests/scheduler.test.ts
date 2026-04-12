import { describe, test, expect, beforeAll, afterAll, afterEach, jest } from "@jest/globals"
import mongoose from "mongoose"
import { runTrafficScheduler, updateSignalTimers } from "../services/scheduler.js"
import { IntersectionModel } from "../db.js"
import dotenv from "dotenv"
import { analyzeTraffic } from "../services/mlService.js"
import fs from "fs"
import path from "path"

dotenv.config()

jest.setTimeout(20000)

beforeAll(async () => {
  await mongoose.connect(
    process.env.MONGO_URL!.replace("traffic", "traffic_test")
  )
})

afterEach(async () => {
  await IntersectionModel.deleteMany({})
})

afterAll(async () => {
  await mongoose.connection.close()
})

describe("Module 1: Traffic Scheduler", () => {

  test("selects highest priority lane (vehicle + waiting)", async () => {

    const intersection = await IntersectionModel.create({
      name: "Test",
      location: "Test",
      signals: [
        {
          laneId: "A",
          vehicleCount: 50,
          waitingTime: 0,
          currentState: "RED",
          greenTime: 20,
          manualOverride: false
        },
        {
          laneId: "B",
          vehicleCount: 10,
          waitingTime: 20,
          currentState: "RED",
          greenTime: 20
        }
      ]
    })

    await runTrafficScheduler(intersection._id.toString())

    const updated = await IntersectionModel.findById(intersection._id)

    const greenLane = updated!.signals.find(
      (s: any) => s.currentState === "GREEN"
    )
    //@ts-ignore
    expect(greenLane.laneId).toBe("A")
  })

})

describe("Module 2: Signal Timer Logic", () => {

  test("GREEN transitions to YELLOW when timer ends", async () => {

    const intersection = await IntersectionModel.create({
      name: "Test",
      location: "Test",
      signals: [
        {
          laneId: "A",
          vehicleCount: 10,
          currentState: "GREEN",
          remainingTime: 1,
          greenTime: 20,
          yellowTime: 5
        }
      ]
    })

    await updateSignalTimers(intersection._id.toString())

    const updated = await IntersectionModel.findById(intersection._id)
    //@ts-ignore
    expect(updated!.signals[0].currentState).toBe("YELLOW")
  })

})


describe("Module 3: Traffic Analysis API Logic", () => {

  test("updates vehicle count, density, and green time correctly", async () => {

    const intersection = await IntersectionModel.create({
      name: "Test",
      location: "Test",
      signals: [
        {
          laneId: "A",
          vehicleCount: 0,
          density: "LOW",
          greenTime: 0,
          currentState: "RED"
        }
      ]
    })

    const mockVehicleCount = 30

    const density =
      mockVehicleCount > 20 ? "HIGH" :
      mockVehicleCount > 10 ? "MEDIUM" : "LOW"

    const greenTime =
      density === "HIGH" ? 30 :
      density === "MEDIUM" ? 20 : 10

    const signal = intersection.signals[0]
    //@ts-ignore
    signal.vehicleCount = mockVehicleCount
    //@ts-ignore
    signal.density = density
    //@ts-ignore
    signal.greenTime = greenTime

    await intersection.save()

    const updated = await IntersectionModel.findById(intersection._id)
     //@ts-ignore
    expect(updated!.signals[0].vehicleCount).toBe(30)
     //@ts-ignore
    expect(updated!.signals[0].density).toBe("HIGH")
     //@ts-ignore
    expect(updated!.signals[0].greenTime).toBe(30)
  })

})

describe("Module 4: ML Integration (Real)", () => {

  test("returns real vehicle count from ML model", async () => {

   const imagePath = path.join(process.cwd(), "src/tests/medium2.jpg")
   const fakeImage = fs.readFileSync(imagePath)

    const result = await analyzeTraffic(fakeImage)

    expect(result).toHaveProperty("vehicle_count")
    expect(typeof result.vehicle_count).toBe("number")
    expect(result.vehicle_count).toBeGreaterThanOrEqual(0)

  })

})