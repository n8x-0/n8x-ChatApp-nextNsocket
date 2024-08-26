import { mongoDBconnection } from "@/DB/connection/connection";
import { Chat, User } from "@/DB/models/userModel";
import { getUserId } from "@/lib/currUserID";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();
    const { chat, chatId } = body;

    try {
        const currUserId = await getUserId(request);
        const image = await User.findOne({_id: currUserId});
        const imageUrl = image.imageUrl
        chat["imageUrl"] = imageUrl;
        const updChat = chat
        
        try {
            await mongoDBconnection();
            const currChat = await Chat.findOne({ _id: chatId });
            currChat.allchats.push(updChat);
            await currChat.save()

            return NextResponse.json({
                chat,
                message: "history created successfully"
            }, { status: 200 })
        } catch (error) {
            return NextResponse.json({
                message: "Cant save the chats"
            }, { status: 500 })
        }
    } catch (error) {
        console.log("no token found in cookie header, plz login again");
        return NextResponse.json({
            message: error,
        }, { status: 401 })
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const chatId = searchParams.get('chatId');
    const recieverId = searchParams.get('recieverId');

    await mongoDBconnection();
    const getUser = await User.findOne({ _id: recieverId })
    const { username, imageUrl } = getUser;
    const userData = {
        username,
        imageUrl
    }

    const getChat = await Chat.findOne({ _id: chatId });

    if (getChat !== null) {
        const allChats = getChat.allchats;
        
        return NextResponse.json({
            userData,
            allChats,
            message: "messages rendered",
        }, { status: 200 })
    }

    console.log("no chats");
    return NextResponse.json({
        message: "zero chats",
    }, { status: 400 })
}