import dotenv from 'dotenv';

dotenv.config();


export const Secret = process.env.JWT_SECRET as string
export const ML_API = process.env.ML_API as string