import { IntersectionModel } from "../db.js"

export const runTrafficScheduler = async (intersectionId: string) => {

  console.log("running traffic scheduler")

  const intersection = await IntersectionModel.findById(intersectionId)
  if (!intersection) return

  let selectedLane: any = null

  for (const signal of intersection.signals) {
    //@ts-ignore
    if (signal.manualOverride) continue

    if (!selectedLane) {
      selectedLane = signal
    } else if (signal.vehicleCount > selectedLane.vehicleCount) {
      selectedLane = signal
    }
  }

  if (!selectedLane) return

  for (const signal of intersection.signals) {
    //@ts-ignore
    if (signal.manualOverride) continue

    if (signal.laneId === selectedLane.laneId) {
      signal.currentState = "GREEN"
      signal.remainingTime = signal.greenTime
    } else {
      signal.currentState = "RED"
      signal.remainingTime = 0
    }
  }

  await intersection.save()
}


export const updateSignalTimers = async (intersectionId: string) => {

  const intersection = await IntersectionModel.findById(intersectionId)
  if (!intersection) return

  let changed = false

  for (const signal of intersection.signals) {
    //@ts-ignore
    if (signal.manualOverride) continue

    if (signal.currentState === "GREEN" || signal.currentState === "YELLOW") {

      signal.remainingTime -= 1

      if (signal.remainingTime <= 0) {

        if (signal.currentState === "GREEN") {
          // FIX: transition GREEN → YELLOW with yellowTime countdown
          signal.currentState = "YELLOW"
          signal.remainingTime = signal.yellowTime
        } else if (signal.currentState === "YELLOW") {
          // FIX: transition YELLOW → RED, then trigger next cycle
          signal.currentState = "RED"
          signal.remainingTime = 0
          changed = true
        }
      }
    }
  }

  await intersection.save()

  // FIX: after a YELLOW→RED transition, pick the next highest-traffic lane
  if (changed) {
    await runTrafficScheduler(intersectionId)
  }
}
