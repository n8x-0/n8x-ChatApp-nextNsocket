import { getUserId } from "@/lib/currUserID";
import { NextResponse } from "next/server";
import { User } from "@/DB/models/userModel";

export async function GET(request: Request) {
    try {
        const currUserId = await getUserId(request)
        return NextResponse.json({
            id: currUserId,
        }, { status: 200 })
    } catch (error) {
        console.log("no token found in cookie header, plz login again");
        return NextResponse.json({
            message: error,
        }, { status: 401 })
    }
}