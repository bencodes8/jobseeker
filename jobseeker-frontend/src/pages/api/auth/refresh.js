import axios from 'axios';
import { parse } from 'cookie';
import { BACKEND_URL } from '@/constants/constants';

export default async function (req, res) {
    if (req.method === 'POST') {
        const cookies = parse(req.headers.cookie || '');
        const refreshToken = cookies.refresh;
        const body = {
            refresh: refreshToken
        }
        
        try {
            const { data } = await axios.post(`${BACKEND_URL}/api/token/refresh`, body)
            res.status(200).json(data);
            
        } catch (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
              } else if (error.request) {
                console.log(error.request);
              } else {
                console.log('Error', error.message);
              }
              console.log(error.config);
        }

    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ message: `Method ${req.method} is not allowed.`});
    }
}