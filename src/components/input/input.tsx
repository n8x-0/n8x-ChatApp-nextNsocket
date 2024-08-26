'use client'

import { Socket } from "socket.io-client";
import { FormEvent, useState } from "react";

type SocketProp = {
    socket: Socket,
    setEmptyMsg: (isEmpty: boolean) => void,
    handleSendMessage: (message: string) => void
};

export function Input({ socket, setEmptyMsg, handleSendMessage }: SocketProp) {
    const [message, setMsg] = useState('');

    const handleSendMsg = (e: React.FormEvent) => {
        e.preventDefault();

        if (message.trim() !== '') {
            handleSendMessage(message);
            setMsg('');
            setEmptyMsg(false);
        } else {
            setEmptyMsg(true);

            setTimeout(() => {
                setEmptyMsg(false);
            }, 1000);
        }
    };

    return (
        <div className="w-full lg:py-8 py-3 bottom-0 left-0 fixed border-t-[1px] border-zinc-700 bg-zinc-800">
            <form onSubmit={handleSendMsg}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMsg(e.target.value)}
                    className="lg:w-1/2 w-[60%] px-5 py-2 lg:ml-12 ml-3 rounded-3xl bg-zinc-400 text-zinc-700 focus:outline-none focus:bg-zinc-200 placeholder:text-zinc-300"
                    placeholder="Write a message"
                />
                <button className="px-6 py-2 bg-yellow-500 text-black font-medium rounded-3xl ml-3">Send</button>
            </form>
        </div>
    );
}
