import { cookies } from "next/headers";
import Link from "next/link";

const Header = () => {
    const cookie = cookies().get('token');

    return (
        <header className="w-full md:px-12 px-5 md:py-5 py-3 flex justify-between items-center fixed top-0 border-b-[1px] border-zinc-700">
            <div className="text-3xl font-medium">n8x</div>
            {!cookie || cookie.value == ''
                ?
                <div className='flex mx-5 gap-4 font-medium'>
                    <Link href='/login'><button className="bg-blue-500 py-2 px-4 rounded-3xl">Login</button></Link>
                    <Link href='/register'><button className="bg-blue-500 py-2 px-4 rounded-3xl">Register</button></Link>
                </div>
                :
                <div className='flex gap-4 font-medium'>
                    <Link href='/profile'>
                        <button className="bg-blue-500 py-2 px-4 rounded-3xl">Profile</button>
                    </Link>
                </div>
            }
        </header>        
    )
}
export default Header;