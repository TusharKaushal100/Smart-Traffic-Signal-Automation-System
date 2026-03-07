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
    intersectionId:mongoose.Types.ObjectId | string
    density:string
    vehicleCount:number
    greenTime:number
}

export interface Signal{
    laneId:string
    direction:string
    currentState:string
    density:string
    vehicleCount:number
    greenTime:number
    yellowTime:number
    remainingTime:number
}
export interface Intersection{
    name:string
    location:string
    signals:Signal[]
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



const signalLogSchema = new Schema<SignalLog>({

    intersectionId:{type:ObjectId,required:true,ref:'intersections'},
    density:{type:String},
    vehicleCount:{type:Number},
    greenTime:{type:Number}

},{timestamps:true})



const signalSchema = new Schema({

    laneId:{type:String,required:true},

    direction:{type:String},

    currentState:{
        type:String,
        enum:["RED","GREEN","YELLOW"],
        default:"RED"
    },

    density:{
        type:String,
        enum:["LOW","MEDIUM","HIGH"],
        default:"LOW"
    },

    vehicleCount:{
        type:Number,
        default:0
    },

    greenTime:{
        type:Number,
        default:20
    },

    yellowTime:{
        type:Number,
        default:5
    },

    remainingTime:{
        type:Number,
        default:0
    }

})



const intersectionSchema = new Schema<Intersection>({

    name:{type:String,required:true},
    location:{type:String},

    signals:[signalSchema]

},{timestamps:true})





export const OfficerModel = model('officers',officerSchema)

export const ViolationModel = model<Violation>('violations',violationSchema)

export const SignalModel = model<SignalLog>('signals',signalLogSchema)

export const IntersectionModel = model<Intersection>('intersections',intersectionSchema)