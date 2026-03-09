import { IntersectionModel } from "../db.js"



export const runTrafficScheduler = async (intersectionId:string) => {

    console.log("running traffic scheduler")

    const intersection = await IntersectionModel.findById(intersectionId)

    if(!intersection){
        return
    }

    let selectedLane:any = null

    for(const signal of intersection.signals){

         //@ts-ignore
        if(signal.manualOverride){
            continue
        }

        if(!selectedLane){

            selectedLane = signal
        }

        else if(signal.vehicleCount > selectedLane.vehicleCount){

            selectedLane = signal
        }

    }

    if(!selectedLane) return

    for(const signal of intersection.signals){
        //@ts-ignore
        if(signal.manualOverride){
            continue
        }

        if(signal.laneId === selectedLane.laneId){

            signal.currentState = "GREEN"
            signal.remainingTime = signal.greenTime

        }

        else{

            signal.currentState = "RED"
            signal.remainingTime = 0

        }

    }

    await intersection.save()

}


export const updateSignalTimers = async (intersectionId:string) => {

    const intersection = await IntersectionModel.findById(intersectionId)

    if(!intersection) return

    let activeSignal = intersection.signals.find(
        s => s.currentState === "GREEN"
    )

    if(!activeSignal) return

    //@ts-ignore
    if(activeSignal.manualOverride) return

    activeSignal.remainingTime -= 1

    if(activeSignal.remainingTime <= 0){

        activeSignal.currentState = "YELLOW"
        activeSignal.remainingTime = activeSignal.yellowTime
    }

    await intersection.save()

}