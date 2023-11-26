import axios from 'axios';
import { BACKEND_URL } from '@/constants/constants';

export default async function (req, res) {
    if (req.method === 'POST') {
        const body = req.body;
        const access = req.headers.authorization;

        const config = {
            headers: {
                Authorization: access
            }
        }

        const { data } = await axios.post(`${BACKEND_URL}/api/jobs`, body, config)
        res.status(200).json({ data });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ message: `Method ${req.method} is not allowed.`});
    }
}