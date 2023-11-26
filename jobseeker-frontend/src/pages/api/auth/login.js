import axios from 'axios';
import cookie from 'cookie';
import { BACKEND_URL } from '@/constants/constants';

export default async function (req, res) {
    if (req.method === 'POST') {
        const { data: loginResponse } = await axios.post(`${BACKEND_URL}/api/token/pair`, req.body);
        
        if (loginResponse && loginResponse.access && loginResponse.refresh) {
            res.setHeader('Set-Cookie', 
                cookie.serialize('refresh', loginResponse.refresh, {httpOnly: true, secure: false, sameSite: 'strict', path: '/'})
            );
            
            const { data: authenticationResponse } = await axios.get(`${BACKEND_URL}/api/auth/user`, {
                headers: {
                    Authorization: `Bearer ${loginResponse.access}`
                }
            });
            if (authenticationResponse) {
                res.status(201).json({ user: authenticationResponse, access: loginResponse.access });
            }
        }

    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ message: `Method ${res.method} is not allowed.`});
    }
}