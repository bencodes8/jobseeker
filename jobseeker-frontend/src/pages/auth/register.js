import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Step,
    StepLabel,
    Stepper,
    TextField,
    Typography,
    Paper
} from '@mui/material';
import { NextLink } from '@/assets/NextLink';
import { Form } from '@/assets/Form';
import { FormBox } from '@/assets/FormBox';
import AuthContext from '@/context/AuthContext';

export default function Register () {
    const { push } = useRouter();
    const { registerUser, setAlert } = React.useContext(AuthContext);

    const [error, setError] = React.useState({
        firstNameField: '',
        lastNameField: '',
        groupField: '',
        usernameField: '',
        emailField: '',
        pwdField: ''
    });
    const [step, setStep] = React.useState(0);
    const steps = ['Name and Position', 'Account Information'];
    const [input, setInput] = React.useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirm: '',
        group: ''
    });

    const handleSelect = (e) => {
        setInput({...input, group: e.target.value});
    };

    const handleNext = () => {
        if (!input.firstName || !input.lastName || !input.group) {
            return setError({
                ...error,
                firstNameField: !input?.firstName ? 'Please fill out this field.' : '',
                lastNameField: !input?.lastName ? 'Please fill out this field.' : '',
                groupField: !input?.group ? 'Please fill out this field.' : ''
            });
        }
        setStep(step + 1);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            username: input.username,
            email: input.email,
            password: input.password,
            confirm: input.confirm,
            first_name: input.firstName,
            last_name: input.lastName,
            group: input.group
        };
        
        const { message, cause, success } = await registerUser(payload);
        
        if (success && !cause) {
            setAlert({ alert: message, severity: "success" });
            push('/auth/login');
        } else {
            setError({...error, 
                usernameField: cause === 'username' ? message : '', 
                emailField: cause === 'email' ? message : '',
                pwdField: cause === 'password' ? message : ''
            });
        }
    }

    return (
        <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Paper elevation={16}>
            <FormBox sx={{ width: {xs: '100%', sm: 500 }}}>
                <Typography variant="h4" sx={{ paddingBottom: 3 }}>Jobseeker</Typography>
                <Stepper activeStep={step} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                <Typography variant="subtitle1" sx={{ textAlign: 'left', paddingTop: 4, paddingBottom: 1 }}>Register Form</Typography>
                <Form onSubmit={handleSubmit}>
                    { step === 0 ? (
                        <>
                            <TextField
                                label="First Name"
                                value={input.firstName}
                                onChange={(e) => setInput({...input, firstName: e.target.value})}
                                error={error.firstNameField ? true : false}
                                helperText={error.firstNameField}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Last Name"
                                value={input.lastName}
                                onChange={(e) => setInput({...input, lastName: e.target.value})}
                                error={error.lastNameField ? true : false}
                                helperText={error.lastNameField}
                                fullWidth
                                required 
                            />
                            <FormControl fullWidth required>
                                <InputLabel error={error.step1 ? true : false}>Group</InputLabel>
                                <Select
                                    value={input.group}
                                    label="Group"
                                    onChange={handleSelect}
                                    error={error.groupField ? true : false}
                                >
                                    <MenuItem value={'Seeker'}>Seeker</MenuItem>
                                    <MenuItem value={'Employer'}>Employer</MenuItem>
                                </Select>
                            </FormControl>
                            <Typography variant="body1" sx={{ textAlign: 'left' }}>
                                Already have an account?
                            </Typography>
                        </>
                    ) : (
                        <>
                            <TextField
                                label="Username"
                                value={input.username}
                                onChange={(e) => setInput({...input, username: e.target.value})}
                                error={error.usernameField ? true : false}
                                helperText={error.usernameField}
                                fullWidth
                                required
                            />
                            <TextField
                                label="E-mail Address"
                                type="email"
                                value={input.email}
                                onChange={(e) => setInput({...input, email: e.target.value})}
                                error={error.emailField ? true : false}
                                helperText={error.emailField}
                                fullWidth
                                required
                            />
                            <TextField
                                label="Password"
                                type="password"
                                value={input.password}
                                onChange={(e) => setInput({...input, password: e.target.value})}
                                error={error.pwdField ? true : false}
                                helperText={error.pwdField}
                                fullWidth
                                required 
                            />
                            <TextField
                                label="Confirm Password"
                                type="password"
                                value={input.confirm}
                                onChange={(e) => setInput({...input, confirm: e.target.value})}
                                error={error.pwdField ? true : false}
                                helperText={error.pwdField}
                                fullWidth
                                required 
                            />
                        </>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 6 }}>
                        { step === 0 ? 
                            <>
                                <NextLink href="/auth/login">
                                    <Typography color="primary">Login Here</Typography>
                                </NextLink>
                                <Button variant="contained" type="button" onClick={handleNext}>Next</Button> 
                            </> 
                            :
                            <>
                                <Button variant="outlined" onClick={() => setStep(step - 1)}>Back</Button>
                                <Button key="submit" variant="contained" type="submit">Register</Button>
                            </>
                        }
                    </Box>
                </Form>
            </FormBox>
        </Paper>
    </Box>
    );
}