import * as React from 'react';
import { Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import AuthContext from '@/context/AuthContext';

export function ConnectButton({ userId, targetUsername }) { 
    const { push } = useRouter();
    const { user, handleConnect, setAlert } = React.useContext(AuthContext);

    return (
        <>
            {user && user.connections.find(o => o.id === userId) ? (
                <Button color="secondary" onClick={() => handleConnect(targetUsername, false)}>Unfollow</Button>
            ) : (
                <Button variant="contained" onClick={() => {
                    if (user) {
                        handleConnect(targetUsername, true);
                    } else {
                        setAlert({ alert: 'Please login to connect with users.'});
                        push('/auth/login');
                    }
                }
                }>Connect</Button>
            )}
        </>
    );
}
