import mongoose from "mongoose"

const {Schema, model} = mongoose
const ObjectId = mongoose.Types.ObjectId


export interface Violation{
    type:string
    plate:string
    location:string
    userId:mongoose.Types.ObjectId | string
}


export interface SignalLog{
    intersection:string
    density:string
    vehicleCount:number
    greenTime:number
}


const officerSchema = new Schema({

    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    role:{type:String,default:"officer"}

},{timestamps:true})


const violationSchema = new Schema<Violation>({

    type:{type:String,required:true},
    plate:{type:String,required:true},
    location:{type:String,required:true},
    userId:{type:ObjectId,ref:'officers'}

},{timestamps:true})


const signalSchema = new Schema<SignalLog>({

    intersection:{type:String,required:true},
    density:{type:String},
    vehicleCount:{type:Number},
    greenTime:{type:Number}

},{timestamps:true})


export const OfficerModel = model('officers',officerSchema)
export const ViolationModel = model<Violation>('violations',violationSchema)
export const SignalModel = model<SignalLog>('signals',signalSchema)

//changed