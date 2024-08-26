'use client'

import { useEffect, useState } from "react";
import Loader from "@/components/loader/loader";
import { useRouter } from "next/navigation";
import ClientSideHeader from "@/components/clientsideHeader/clientsideHeader";
import Link from "next/link";

interface User {
  _id: string;
  username: string;
  imageUrl: string;
  email: string;
}


const Users = () => {
  const [allUsers, setAllUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true);
  const [currUserId, setCurrUserId] = useState<string | null>(null);
  const [searchUser, setSearchUser] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchCurrUserId = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chatowner`, { method: "GET", headers: { "Contet-Type": "application/json" } })
      const json = await res.json();
      if (res.ok) {
        setCurrUserId(json.id)
      }
    }
    const fetchAllUsers = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`, { method: "GET", headers: { "Contet-Type": "application/json" } });
      const json = await res.json();
      if (res.ok) {
        setAllUsers(json.allUsers)
      }
    }
    const main = async () => {
      try {
        await fetchCurrUserId()
        await fetchAllUsers()
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    main()
  }, [])

  async function createChat(id: string) {
    const recieverId = id;
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/createchat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recieverId }),
      })
      const json = await res.json();

      if (res.ok) {
        router.push(`/${json.recieverId}/${json.currChatId}`)
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return <Loader style="w-20 h-20 rounded-full border-4 border-zinc-300 border-t-zinc-600 animate-spin" />
  }

  return (
    <div className='w-full flex justify-center items-center'>
      <ClientSideHeader>
        <div>
          <input type="text" placeholder="Search" onChange={(e) => setSearchUser(e.target.value)} className="md:w-96 w-[60%] md:mr-2 px-5 md:py-2 py-[6px] rounded-3xl bg-zinc-200 focus:outline-none" />
        </div>
        <Link href='/'><button className="bg-blue-500 py-2 px-4 rounded-3xl hover:scale-105 hover:transition-all duration-500" onClick={() => setLoading(true)}>Home</button></Link>
      </ClientSideHeader>
      <div className="cardCont md:px-12 px-4 flex md:gap-5 gap-2 flex-wrap justify-center py-24 w-full xl:w-[80%]">
        {allUsers
          .filter(user => user._id !== currUserId)
          .filter(user => {
            if (searchUser !== '') {
              return user.username.toLowerCase().includes(searchUser.toLowerCase());
            }
            return user;
          })
          .map(({ _id, username, imageUrl, email }) => (
            <div className="card md:w-72 w-full bg-zinc-600 rounded-lg p-4 shadow-lg shadow-zinc-900 md:block flex justify-between" key={_id}>
              <div>
                <div className="md:block flex gap-3">
                  <div className="md:w-full md:h-40 w-20 h-20 overflow-hidden md:rounded-lg rounded-full">
                    <img src={!imageUrl ? 'https://cdn-icons-png.flaticon.com/512/847/847969.png' : imageUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="leading-4">
                    <h1 className="text-2xl font-semibold pt-2">{username}</h1>
                    <span className="text-sm font-light">{email}</span>
                  </div>
                </div>
                <p className="leading-5 my-2 md:inline-block text-zinc-300 md:w-full w-[90%]">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero repellat corporis illo sapiente.
                </p>
              </div>
              <div className="flex flex-col md:flex-row w-fit gap-2 my-2 font-medium">
                <div onClick={() => createChat(_id)} className="bg-zinc-700/20 p-2 w-14 h-14 rounded-full shadow-md shadow-zinc-800 cursor-pointer overflow-hidden hover:scale-110 hover:transition-all duration-500">
                  <img src="https://cdn-icons-png.flaticon.com/512/566/566718.png" alt="" className="w-full h-full object-cover invert p-1" />
                </div>
                <div className="bg-zinc-700/60 p-2 w-14 h-14 cursor-not-allowed rounded-full shadow-md shadow-zinc-800 overflow-hidden hover:scale-110 hover:transition-all duration-500">
                  <img src="https://cdn-icons-png.flaticon.com/512/4202/4202259.png" alt="" className="w-full h-full object-cover invert p-1" />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
export default Users;