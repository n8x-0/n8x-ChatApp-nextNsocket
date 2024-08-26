'use client';

import { io } from 'socket.io-client';
import { Chats } from '@/components/chats/chats';

const socket = io('https://socketnext-chatapp.glitch.me');

const UserChats = ({ params }: { params: { chatID: string[] } }) => {

  return (
    <div className='w-full lg:p-12 p-3'>
      <Chats socket={socket} recieverId={params.chatID[0]} chatId={params.chatID[1]} />
    </div>
  );
}

export default UserChats;