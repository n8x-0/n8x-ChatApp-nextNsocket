'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const handleSignOut = async () => {
    try {
        cookies().delete("token");
        redirect('/login')
    } catch (err) {
        console.error('Unable to sign out')
    }
};
export default handleSignOut