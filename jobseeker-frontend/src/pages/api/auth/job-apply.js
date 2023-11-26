import axios from 'axios';
import { BACKEND_URL } from '@/constants/constants';

export default async function (req, res) {
    if (req.method === 'POST') {
        const { job_posting_id } = req.body;
        const access = req.headers.authorization;

        const config = {
            headers: {
                Authorization: access
            }
        }

        const { data } = await axios.post(`${BACKEND_URL}/api/jobs/apply?job_posting_id=${job_posting_id}`, null, config)
        res.status(201).json(data);
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ message: `Method ${req.method} is not allowed.`});
    }
}