'use client';

import ClientSideHeader from "@/components/clientsideHeader/clientsideHeader";
import Loader from "@/components/loader/loader";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  _id: string;
  username: string;
  imageUrl: string;
  email: string;
}

const ChatsWithSomeone = () => {

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [chatID, setChatID] = useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>()

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/getcreatedchats`, {
          method: "GET",
          headers: {
            "Contet-Type": "application/json"
          }
        });
        const json = await res.json();

        if (res.ok) {
          setAllUsers(json.chats)
        }
      } catch (err) {
        setError("An error occured, please reload the page")
        console.log("errors fetching users", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAllUsers()
  }, [])

  if (error) {
    console.log(error);
  }
  if (loading) {
    return <Loader style="w-20 h-20 rounded-full border-4 border-zinc-300 border-t-zinc-600 animate-spin" />
  }

  return (
    <div className='w-full h-screen'>
      <ClientSideHeader>
        <Link href='/'><button className="bg-blue-500 py-2 px-4 rounded-3xl hover:scale-105 hover:transition-all duration-500">Home</button></Link>
      </ClientSideHeader>
      <div className="chatContainer py-24 h-full">
        {allUsers.length === 0 ?
          <div className="w-full h-full flex justify-center items-center">
            <div className="w-fit h-fit bg-zinc-600 rounded-3xl p-3 py-7">
              <h2 className="p-2 pb-4">No chats. Add someone to chat</h2>
              <div className="w-full">
                <Link href="/users">
                  <div className="px-5 py-2 bg-zinc-800 rounded-3xl hover:scale-105 hover:transition-all duration-300 w-fit">Add</div>
                </Link>
              </div>
            </div>
          </div>
          :
          allUsers.map((data: any) => {
            return (
              <Link href={`${data.chatData._id.toString()}/${data.chatId}`}>
                <div className="flex w-full items-center gap-5 md:px-10 px-3" key={data.chatData._id}>
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <img src={data.chatData.imageUrl} alt='profile image' className="w-full h-full object-cover" />
                  </div>
                  <div className="leading-3">
                    <h2 className="md:font-bold font-semibold md:text-xl text-lg">{data.chatData.username}</h2>
                    <p className="font-light">where are you</p>
                  </div>
                </div>
                <hr className="w-full my-3 border-zinc-700" />
              </Link>
            )
          })}
      </div>
    </div>
  )
}
export default ChatsWithSomeone;