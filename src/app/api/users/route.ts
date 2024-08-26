import { mongoDBconnection } from "@/DB/connection/connection";
import { User } from "@/DB/models/userModel";
import { parse } from "cookie";
import { NextResponse } from "next/server";
import * as jose from 'jose';
import { getUserId } from "@/lib/currUserID";

export async function GET(request: Request) {

    try {
        const currUserId = await getUserId(request);
        try {
            await mongoDBconnection();
        } catch (err) {
            return NextResponse.json({
                message: "error connecting to the database",
                error: err
            }, { status: 500 })
        }
        try {
            let allUsers = await User.find({});
            return NextResponse.json({
                message: "fetched all users",
                allUsers: allUsers
            }, { status: 200 })
        } catch (err) {
            return NextResponse.json({
                message: "error getting users",
                error: err
            }, { status: 500 })
        }
    } catch (error) {
        console.log("no token found in cookie header, plz login again");
        return NextResponse.json({
            message: error,
        }, { status: 401 })
    }
}