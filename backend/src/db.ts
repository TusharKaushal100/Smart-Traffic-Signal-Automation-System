// import mongoose from "mongoose";
// import { describe } from "zod/v4/core";


// const {model,Schema} = mongoose;
// const ObjectId = mongoose.Types.ObjectId;

// export interface Question{
//       title:string,
//       description:string,
//       tags?:[string],
//       userId: mongoose.Types.ObjectId | string

// }

// export interface Answer{
//       content:string,
//       questionId:mongoose.Types.ObjectId,
//       userId:mongoose.Types.ObjectId   // because it is compile time so it only accepts types so you have to write fully 
//       upvote:mongoose.Types.ObjectId[]  // [mongoose.Types.ObjectId] this couldnt be done because it means tuple with only one element  
// }