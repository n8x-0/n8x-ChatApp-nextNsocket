'use client'

import { Socket } from "socket.io-client";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/input/input";
import EmptyMsgAlert from "../emptymsgalert/emptymsgalert";
import Loader  from '@/components/loader/loader'

type SocketProp = { socket: Socket, recieverId: string, chatId: string };
interface messageIface {
    message: string;
    userId: string;
    imageUrl: string
}

export function Chats({ socket, recieverId, chatId }: SocketProp) {
    const [allChats, setAllChats] = useState<messageIface[]>([]);
    const [currUserId, setCurrUserId] = useState<string | null>(null);
    const [recieverData, setRecieverData] = useState<{ username: string, imageUrl: string } | null>(null);
    const [isEmptyMsg, setEmptyMsg] = useState(false);
    const [loading, setLoading] = useState(true);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchCurrentUser() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chatowner`, { method: "GET" });
                const json = await response.json();
                setCurrUserId(json.id);
                socket.emit("join_chat", { chatId, userId: json.id });
            } catch (error) {
                console.log(error);
            }
        }

        const handleReceiveMessage = (data: messageIface) => {
            setAllChats(prev => [...prev, data]);
        };


        const fetchChatHistory = async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chatshistory?chatId=${chatId}&recieverId=${recieverId}`, { method: "GET" });
            const json = await res.json();

            if (res.ok) {
                setAllChats(json.allChats);
                setRecieverData(json.userData)
            }
        };

        try {
            fetchChatHistory();
            fetchCurrentUser();
            socket.on("rcv_msg", handleReceiveMessage);
        } finally {
            setLoading(false)
        }

        return () => {
            socket.off("rcv_msg", handleReceiveMessage);
        };
    }, [socket, chatId]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [allChats]);

    const handleSendMessage = async (message: string) => {
        if (!currUserId) return;

        const newMessage = { message, userId: currUserId, imageUrl: 'https://cdn-icons-png.flaticon.com/512/847/847969.png' };

        socket.emit("send_message", { chatId, data: newMessage });

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chatshistory`, {
                method: "POST",
                body: JSON.stringify({ chat: newMessage, chatId })
            });
        } catch (error) {
            console.error("Error saving message:", error);
        }
    };

    const deleteAllChat = async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/deletallchat`, {method: 'POST', body: JSON.stringify({chatId})});
        const json = await res.json();
        
        res.ok ? console.log(json.message) : console.log("error deleting chat");
        window.location.reload();    
    }

    if (loading) {
        return <Loader style={"w-10 h-10 rounded-full border-2 border-zinc-300 border-t-zinc-600 animate-spin"}/>
    }

    return (
        <div className="w-full h-full">
            {isEmptyMsg && <EmptyMsgAlert />}
            <header className="flex items-center justify-between fixed top-0 left-0 lg:px-12 px-5 lg:py-6 py-3 w-full border-b-zinc-700 border-b-[1px] bg-zinc-800">
                <div className="flex items-center gap-5">
                    <div className="lg:w-16 lg:h-16 w-12 h-12 rounded-full overflow-hidden">
                        <img src={recieverData?.imageUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="leading-4">
                        <h1 className="text-2xl font-bold">{recieverData?.username}</h1>
                        <span className={`text-green-400`}>online</span>
                    </div>
                </div>
                {allChats.length !== 0 ? <div onClick={deleteAllChat} className="px-4 py-2 bg-red-600 rounded-3xl font-medium cursor-pointer">Delete Chat</div> : <></>}
            </header>
            <div className="w-full h-full py-20">
                {allChats.map((data, index) => (
                    <div key={index} className={`w-full flex items-center ${data.userId === currUserId ? 'justify-end' : ''}`}>
                        {data.userId !== currUserId ?
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                <img src={data.imageUrl} alt="" className="w-full h-full object-cover" />
                            </div> : <></>
                        }
                        <span className={`px-5 py-3 mx-2 my-1 inline-block rounded-3xl tracking-tight sm:max-w-96 max-w-52 leading-5 ${data.userId === currUserId ? 'bg-zinc-200 text-black' : 'bg-zinc-700'}`}>
                            {data.message}
                        </span>
                        {data.userId === currUserId ?
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                                <img src={data.imageUrl} alt="" />
                            </div> : <></>
                        }
                    </div>
                ))}
            </div>
            <Input socket={socket} setEmptyMsg={setEmptyMsg} handleSendMessage={handleSendMessage} />
        </div>
    );
}
