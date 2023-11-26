import axios from "axios";
import { BACKEND_URL } from "@/constants/constants";

export default async function (req, res) {
    if (req.method === 'PUT') {
        const body = req.body;
        const access = req.headers.authorization;

        const config = {
            headers: {
                Authorization: access
            }
        }

        const { data } = await axios.put(`${BACKEND_URL}/api/auth/profile/edit`, body, config)
        res.status(201).json({ data });
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).json({ message: `Method ${req.method} is not allowed.`});
    }
}