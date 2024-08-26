'use client'

import Loader from '@/components/loader/loader';
import handleSignOut from '@/lib/signOutHandler';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ClientSideHeader from '@/components/clientsideHeader/clientsideHeader';

const profile = () => {

    const [userData, setUserData] = useState(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/profile`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                const json = await res.json();

                if (res.ok) {
                    setUserData(json.userData);
                } else {
                    setError(json.error);
                }
            } catch (err) {
                setError('An error occurred');
                console.error('Error fetching user profile:', err);
            }
        };

        fetchUserProfile();
    }, []);

    if (error) {
        return <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>Error: Please Login First</div>;
    }

    if (!userData || loading) {
        return <Loader style="w-20 h-20 rounded-full border-4 border-zinc-300 border-t-zinc-600 animate-spin" />;
    }

    let { username, imageUrl, email } = userData
    return (
        <div className="w-full h-screen bg-zinc-800">
            <ClientSideHeader>
                <Link href='/'><button className="bg-blue-500 py-2 px-4 rounded-3xl hover:scale-105 hover:transition-all duration-500" onClick={() => setLoading(true)}>Home</button></Link>
                <Link href='/'><button className="bg-blue-500 py-2 px-4 rounded-3xl hover:scale-105 hover:transition-all duration-500" onClick={() => {
                    handleSignOut();
                    setLoading(true);
                }}>Sign Out</button></Link>
            </ClientSideHeader>
            <div className="sm:px-12 px-4 py-24">
                <div className="w-40 h-40 bg-black rounded-full overflow-hidden my-4">
                    <img src={!imageUrl ? '   https://cdn-icons-png.flaticon.com/512/847/847969.png' : imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
                <h1 className="text-3xl font-bold">{username}</h1>
                <span className="font-thin">{email}</span>
                <p className="lg:w-1/2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae ea nulla commodi unde sunt eum tempore reiciendis voluptate amet, cumque aut placeat molestiae, doloremque eligendi libero hic! Numquam, voluptates porro.
                </p>
            </div>
        </div>
    )
}
export default profile;