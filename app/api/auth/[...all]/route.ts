import { getAuthServer } from '@/lib/auth/authServer';
import dbConnect from '@/lib/db/mongo';
import { toNextJsHandler } from 'better-auth/next-js';

const db = await dbConnect();
const auth = getAuthServer(db.connection.getClient());

export const { POST, GET } = toNextJsHandler(auth);
