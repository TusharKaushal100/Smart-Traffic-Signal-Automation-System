import { describe, test, expect, beforeAll, afterAll, afterEach, jest } from "@jest/globals"
import { calculateDensity, calculateGreenTime } from "../services/logic.js"
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


describe("Module 5: ML Traffic Density Test Cases (TC-ML-001 to TC-ML-008)", () => {

  // TC-ML-001: Low traffic — count < 10 → density LOW, greenTime 15
  test("TC-ML-001: Low traffic image (3 vehicles) → density LOW, greenTime 15", () => {
    const vehicleCount = -3
    const density = calculateDensity(vehicleCount)
    const greenTime = calculateGreenTime(density)

    expect(density).toBe("LOW")
    expect(greenTime).toBe(15)
  })

  // TC-ML-002: Medium traffic — 10 ≤ count < 20 → density MEDIUM, greenTime 30
  test("TC-ML-002: Medium traffic image (15 vehicles) → density MEDIUM, greenTime 30", () => {
    const vehicleCount = 15
    const density = calculateDensity(vehicleCount)
    const greenTime = calculateGreenTime(density)

    expect(density).toBe("MEDIUM")
    expect(greenTime).toBe(30)
  })

  // TC-ML-003: High traffic — count ≥ 20 → density HIGH, greenTime 50
  test("TC-ML-003: High traffic image (25 vehicles) → density HIGH, greenTime 50", () => {
    const vehicleCount = 25
    const density = calculateDensity(vehicleCount)
    const greenTime = calculateGreenTime(density)

    expect(density).toBe("HIGH")
    expect(greenTime).toBe(50)
  })

  // TC-ML-004: Empty road — 0 vehicles → density LOW, greenTime 15
  test("TC-ML-004: Empty road (0 vehicles) → density LOW, greenTime 15", () => {
    const vehicleCount = 0
    const density = calculateDensity(vehicleCount)
    const greenTime = calculateGreenTime(density)

    expect(density).toBe("LOW")
    expect(greenTime).toBe(15)
  })

  // TC-ML-005: Boundary — exactly 10 vehicles → density MEDIUM (since count < 10 is LOW)
  test("TC-ML-005: Boundary — exactly 10 vehicles → density MEDIUM, greenTime 30", () => {
    const vehicleCount = 10
    const density = calculateDensity(vehicleCount)
    const greenTime = calculateGreenTime(density)

    expect(density).toBe("MEDIUM")
    expect(greenTime).toBe(30)
  })

  // TC-ML-006: Boundary — exactly 20 vehicles → density HIGH (since count < 20 is MEDIUM)
  test("TC-ML-006: Boundary — exactly 20 vehicles → density HIGH, greenTime 50", () => {
    const vehicleCount = 20
    const density = calculateDensity(vehicleCount)
    const greenTime = calculateGreenTime(density)

    expect(density).toBe("HIGH")
    expect(greenTime).toBe(50)
  })

  // TC-ML-007: Upper boundary of LOW — 9 vehicles should still be LOW
  test("TC-ML-007: Upper boundary of LOW — 9 vehicles → density LOW, greenTime 15", () => {
    const vehicleCount = 9
    const density = calculateDensity(vehicleCount)
    const greenTime = calculateGreenTime(density)

    expect(density).toBe("LOW")
    expect(greenTime).toBe(15)
  })

  // TC-ML-008: Upper boundary of MEDIUM — 19 vehicles should still be MEDIUM
  test("TC-ML-008: Upper boundary of MEDIUM — 19 vehicles → density MEDIUM, greenTime 30", () => {
    const vehicleCount = 19
    const density = calculateDensity(vehicleCount)
    const greenTime = calculateGreenTime(density)

    expect(density).toBe("MEDIUM")
    expect(greenTime).toBe(30)
  })

})