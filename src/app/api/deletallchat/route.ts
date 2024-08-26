import { Chat } from "@/DB/models/userModel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const chatId = await request.json();

    const deleteChat = await Chat.findOne({ _id: chatId.chatId });
    deleteChat.allchats = [];
    deleteChat.save();
    console.log(deleteChat);

    return NextResponse.json({
        message: "chats deleted successfully"
    }, { status: 200 })
}