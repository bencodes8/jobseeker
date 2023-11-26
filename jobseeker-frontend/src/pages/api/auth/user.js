import axios from 'axios';
import { BACKEND_URL } from '@/constants/constants';

export default async function (req, res) {
    if (req.method === 'GET') {
        const access = req.headers.authorization;
        const config = {
            headers: {
                Authorization: access
            }
        }
        const { data } = await axios.get(`${BACKEND_URL}/api/auth/user`, config)
        res.status(200).json(data);
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).json({ message: `Method ${res.method} is not allowed.`});
    }
}