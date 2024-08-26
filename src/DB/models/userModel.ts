import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    imageUrl: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    chats: [
        {
            refId:  { type: String, ref: 'User' },
            chatId: { type: String, ref: 'Chat' },
        }
    ]
}, { timestamps: true });

userModel.index({ _id: 1, 'chats.chatId': 1 }, { unique: true });
export const User = mongoose.models.User || mongoose.model('User', userModel);

const chatModel = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    recieverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    allchats: [{ message: String, userId: String, imageUrl: String }]
}, { timestamps: true })

export const Chat = mongoose.models.Chat || mongoose.model('Chat', chatModel); 