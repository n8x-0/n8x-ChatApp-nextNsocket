import { User } from "@/DB/models/userModel";
import { mongoDBconnection } from '@/DB/connection/connection';
import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getUserId } from '@/lib/currUserID';

export async function POST(request: Request) {

    try {
        const userId = await getUserId(request);
        try {
            await mongoDBconnection();
            const userData = await User.findOne({ _id: new ObjectId(userId) })

            return NextResponse.json({
                userData: userData,
                message: "user profile exist"
            }, { status: 200 })
        } catch (err) {
            return NextResponse.json({
                error: `cant find user, please login again, ${err}`,
            }, { status: 404 })
        }
    } catch (error) {
        console.log("no token found in cookie header, plz login again");
        return NextResponse.json({
            message: error,
        }, { status: 401 })
    }
}