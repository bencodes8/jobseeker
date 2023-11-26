import axios from 'axios';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { FRONTEND_URL } from '@/constants/constants';

const AuthContext = React.createContext();
export default AuthContext;

export function AuthProvider({ children }) {
    const { push } = useRouter();
    const [user, setUser] = React.useState(null);
    const [accessToken, setAccessToken] = React.useState(null);
    const [alert, setAlert] = React.useState({
        alert: '',
        severity: ''
    });
    const [error, setError] = React.useState({});

    React.useEffect(() => {
        authenticateUser();
    }, [])

    async function authenticateUser() {
        try {
            const access = await useRefreshToken();
            if (access) setAccessToken(access);
    
            const config = {
                headers: {
                    Authorization: `Bearer ${access}`
                }
            }
    
            const { data: authenticationResponse } = await axios.get(`${FRONTEND_URL}/api/auth/user`, config);
            if (authenticationResponse) {
                setUser(authenticationResponse);

            }    
        } catch {
            logoutUser();
        }
    }

    async function useRefreshToken() {
        try {
            const { data: tokens } = await axios.post(`${FRONTEND_URL}/api/auth/refresh`);
            return tokens.access;
        } catch {
            throw new Error('Refresh Token Request failed.');
        }
    }

    async function registerUser(payload) {
        const { data: registrationResponse } = await axios.post(`${FRONTEND_URL}/api/auth/register`, payload);
        return registrationResponse;
    }

    async function loginUser(payload) {
        const { data: loginResponse } = await axios.post(`${FRONTEND_URL}/api/auth/login`, payload);
        if (loginResponse && loginResponse.user && loginResponse.access) {
            setAccessToken(loginResponse.access);
            setUser(loginResponse.user);
            push('/');
        }
    }

    async function logoutUser() {
        const { data } = await axios.post(`${FRONTEND_URL}/api/auth/logout`);
        setUser(null);
        setAccessToken(null);
        push('/');
    }

    async function handleConnect(target, connect) {
        const payload = {
            target_username: target,
            connect: connect    
        }

        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        }

        const { data: connectResponse } = await axios.put(`${FRONTEND_URL}/api/auth/connect-user`, payload, config)
        if (connectResponse) {
            setUser(prevState => {
                const newState = {...prevState};

                newState.connections = connectResponse.data.user.connections
                return newState;
            });
        }
    }

    async function handleEditProfile(payload) {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        }

        const { data: editProfileResponse } = await axios.put(`${FRONTEND_URL}/api/auth/edit-profile`, payload, config)

        if (editProfileResponse) {
            setUser(prevState => {
                const newState = {...prevState};

                newState.interests = editProfileResponse.data.interests;
                newState.about_me = editProfileResponse.data.about_me;
                return newState;
            });
        }
    }

    async function handleCreateJobPost(payload) {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        }

        const { data: postResponse } = await axios.post(`${FRONTEND_URL}/api/auth/create-job-post`, payload, config);
        if (postResponse) {
            return postResponse;
        }
    }

    async function handleJobApplication(job_posting_id) {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        }

        const payload = {
            job_posting_id: job_posting_id
        }

        const { data: jobPostingData } = await axios.post(`${FRONTEND_URL}/api/auth/job-apply`, payload, config);
        if (jobPostingData) {
            return jobPostingData;
        }
    }

    async function handleApplicationResponse(job_posting_id, applicant_username, accept) {
        const config = {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            }
        }

        const payload = {
            job_posting_id: job_posting_id,
            applicant_username: applicant_username,
            accept: accept
        }


        const { data: applicationResponse } = await axios.put(`${FRONTEND_URL}/api/auth/application-response`, payload, config);
        if (applicationResponse) {
            return applicationResponse;
        }
    }

    const contextData = {
        user: user, setUser: setUser,
        accessToken: accessToken, setAccessToken: setAccessToken,
        alert: alert, setAlert: setAlert,
        error: error, setError: setError,
        registerUser, loginUser, logoutUser, handleConnect, handleEditProfile, handleCreateJobPost, handleJobApplication, handleApplicationResponse
    }

    return (
        <AuthContext.Provider value={contextData} >
            {children}
        </AuthContext.Provider>
    );
}