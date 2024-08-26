import mongoose from "mongoose";

export async function mongoDBconnection() {
    try {
        await mongoose.connect(process.env.MONGODB_URL || '')
    } catch (err) {
        console.log(err + "connection failed");
    }
}