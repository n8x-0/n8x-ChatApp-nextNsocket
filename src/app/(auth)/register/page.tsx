'use client';

import Link from 'next/link';
import handleRegister from '../../../lib/registerHandler';
import { useState } from 'react';
import Loader from '@/components/loader/loader';
import { BgSlider } from '@/components/bgSlider/bgSlider';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await handleRegister(formData);
      if (res.error) {
        setError(res.error);
        setTimeout(()=> {
          setError(null)
      },2000)
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-zinc-800 text-white flex justify-center items-center">
      <BgSlider />
      <div className="xl:w-[30%] md:w-1/2 w-[80%] rounded-3xl sm:py-8 px-4 py-6 glassMorph">
        <h1 className="w-full text-center text-3xl font-bold my-6 font-[sauda]">NixiPixi</h1>
        <form onSubmit={onSubmit} className="w-full flex flex-col gap-3 my-6">
          <input name="username" type="text" placeholder="username" required className="bg-zinc-400 rounded-3xl focus:outline-none px-4 py-3 placeholder:text-zinc-300 shadow-sm shadow-zinc-800" />
          <input name="imageUrl" type="text" placeholder="image url" className="bg-zinc-400 rounded-3xl focus:outline-none px-4 py-3 placeholder:text-zinc-300 shadow-sm shadow-zinc-800" />
          <input name="email" type="email" placeholder="email" required className="bg-zinc-400 rounded-3xl focus:outline-none px-4 py-3 placeholder:text-zinc-300 shadow-sm shadow-zinc-800" />
          <input name="password" type="password" placeholder="password" required className="bg-zinc-400 rounded-3xl focus:outline-none px-4 py-3 placeholder:text-zinc-300 shadow-sm shadow-zinc-800" />
          <button type="submit" className="bg-blue-500 px-6 py-2 rounded-3xl relative w-fit font-medium shadow-md shadow-zinc-800">
            {loading ? <div className="p-3"><Loader style="w-6 h-6 rounded-full border-2 border-blue-300 border-t-blue-600 animate-spin" /></div> : 'Register'}
          </button>
          {error && <p className='px-2 text-red-400'>{error}</p>}
        </form>
        <p className="px-2">
          Already have an account <b className="underline"><Link href={'/login'}>Login</Link></b>
        </p>
      </div>
    </div>
  );
}
export default Register;