import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
    Alert, 
    Box,
    Button,
    TextField,
    Typography,
    Paper
} from '@mui/material';
import AuthContext from '@/context/AuthContext';
import { Form } from '@/assets/Form';
import { FormBox } from '@/assets/FormBox';
import { NextLink } from '@/assets/NextLink';

export default function Login () {
    const { push } = useRouter();
    const { alert, user, loginUser } = React.useContext(AuthContext);
    const [input, setInput] = React.useState({
        username: '',
        password: ''
    });

    React.useEffect(() => {
        if (user) {
            push('/');
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = { username: input.username, password: input.password }
        loginUser(payload);
    }

    return (
        <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Paper elevation={16}>
                <FormBox sx={{ width: {xs: '100%', sm: 500 }}}>
                    <Typography variant="h4" sx={{ paddingBottom: 3 }}>Jobseeker</Typography>
                    <Alert variant="outlined" severity={alert.severity === 'error' ? 'error' : alert.severity === 'success' ? 'success' : 'info'} sx={{ marginBottom: 2, display: alert.alert ? 'in-line' : 'none' }}>
                        {alert.alert}
                    </Alert>
                    <Typography variant="subtitle1" sx={{ textAlign: 'left', paddingBottom: 1 }}>Login Form</Typography>
                    <Form onSubmit={handleSubmit}>
                        <TextField
                            label="Username"
                            value={input.username}
                            onChange={(e) => setInput({...input, username: e.target.value})}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Password"
                            type="password"
                            value={input.password}
                            onChange={(e) => setInput({...input, password: e.target.value})}
                            fullWidth
                            required 
                        />
                        <Typography variant="body1" sx={{ textAlign: 'left' }}>
                            Do not have an account?
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6 }}>
                            <NextLink href="/auth/register">
                                <Typography variant="subtitle1" color="primary">Register Here</Typography>
                            </NextLink>
                            <Button variant="contained" type="submit">Login</Button>
                        </Box>
                    </Form>
                </FormBox>
            </Paper>
        </Box>
    );
}