import { NextResponse } from "next/server";
import { User, Chat } from "@/DB/models/userModel";
import { mongoDBconnection } from "@/DB/connection/connection";
import { getUserId } from "@/lib/currUserID";

export async function POST(request: Request) {
    const { recieverId } = await request.json();

    try {
        const currUserId = await getUserId(request)

        if (recieverId === currUserId) {
            return NextResponse.json({
                message: "Cant Chat yourself dumb",
            }, { status: 400 })
        }
        
        try {
            await mongoDBconnection();
            const chatAlreadyExist = await Chat.findOne({
                $or: [
                    { senderId: currUserId, recieverId },
                    { senderId: recieverId, recieverId: currUserId }
                ]
            });

            if (chatAlreadyExist) {
                const currChatId = chatAlreadyExist._id.toString();
                return NextResponse.json({
                    currChatId,
                    recieverId,
                    message: "User already exist",
                }, { status: 200 })
            }

            const newChat = await Chat.create({
                senderId: currUserId,
                recieverId,
                allchats: []
            });

            const getCurrChatID = await Chat.findOne({
                $or: [
                    { senderId: currUserId, recieverId },
                    { senderId: recieverId, recieverId: currUserId }
                ]
            });
            const currChatId = getCurrChatID._id.toString();

            const updateCurrUserChats = await User.findOne({ _id: currUserId });
            const updateSenderChats = await User.findOne({ _id: recieverId });

            updateCurrUserChats.chats.push({ refId: recieverId, chatId: currChatId });
            updateSenderChats.chats.push({ refId: currUserId, chatId: currChatId });
            await updateCurrUserChats.save();
            await updateSenderChats.save();

            return NextResponse.json({
                currChatId,
                recieverId,
                message: "User created succsesfully"
            }, { status: 200 })

        } catch (error) {

            console.log('just an error', error);
            return NextResponse.json({
                message: `Error creating chat with this user: ${error}`
            }, { status: 400 })
        }
    } catch (error) {
        console.log("no token found in cookie header, plz login again");
        return NextResponse.json({
            message: error,
        }, { status: 401 })
    }
}