import { mongoDBconnection } from '@/DB/connection/connection';
import { User } from '@/DB/models/userModel';
import { getUserId } from '@/lib/currUserID';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {

    try {
        const currUserId = await getUserId(request)
        try {
            await mongoDBconnection();

            const user = await User.findOne({ _id: currUserId }).exec();
            if (!user) {
                return NextResponse.json({ message: "User not found" }, { status: 404 });
            }

            const chats = user.chats;

            const chatsDataPromises = chats.map(async (chat: any) => {
                const chatDetails = await User.findOne({ _id: chat.refId }).exec();
                if (!chatDetails) return null;
                return {
                    chatId: chat.chatId,
                    chatData: {
                        _id: chatDetails._id,
                        imageUrl: chatDetails.imageUrl,
                        username: chatDetails.username
                    }
                };
            });

            const chatsData = (await Promise.all(chatsDataPromises)).filter((data) => data !== null);

            return NextResponse.json({
                chats: chatsData,
                message: "Chats data retrieved successfully"
            }, { status: 200 });

        } catch (error) {
            console.error('Error retrieving chats:', error);
            return NextResponse.json({
                message: "Error getting created chats"
            }, { status: 500 });
        }
    } catch (error) {
        console.log("no token found in cookie header, plz login again");
        return NextResponse.json({
            message: error,
        }, { status: 401 })
    }
}
