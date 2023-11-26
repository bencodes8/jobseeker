import axios from 'axios';
import { BACKEND_URL } from '@/constants/constants';

export default async function (req, res) {
    if (req.method == 'POST') {
        const { data: registerResponse } = await axios.post(`${BACKEND_URL}/api/register`, req.body)
        res.status(201).json(registerResponse);
    } else {
        res.setHeader('Allow', ['POST']);
        res.status.json({ message: `Method ${res.method} is not allowed.`});
    }
}