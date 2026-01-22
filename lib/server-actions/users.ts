'use server'

import User from '@/lib/models/user';

export async function getUser() {
    try {
       const user = await User.findById('696e89b54f138149a24204d3').lean();
       return user; 
    } catch (error) {
       console.error('Unable to get user', error); 
    }
}