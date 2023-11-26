import * as React from 'react';
import axios from 'axios';
import { 
    Box,
    Card,
    CardContent,
    IconButton,
    Modal,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelIcon from '@mui/icons-material/Cancel';
import { NextLink } from '@/assets/NextLink';
import AuthContext from '@/context/AuthContext';

export default function ApplicantModal (props) {
    const { user, handleApplicationResponse } = React.useContext(AuthContext);
    const { isModalOpen, handleCloseModal, applicants, jobId, applicationStatus, setApplicationStatus } = props;

    const style = {
        position: 'relative',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '50%',
        height: '750px',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };


    return (
        <>
            <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
            >
                <Box sx={style}>
                    <IconButton sx={{ position: 'absolute', top: 15, right: 15}} onClick={handleCloseModal}>
                        <CloseIcon />
                    </IconButton>
                    <Typography variant="h6" padding={1} textAlign={'center'}>List of Applicants</Typography>
                    <hr />
                    <Box sx={{ height: '100%', overflowY: 'auto' }}>
                        {applicants.length > 0 ? applicants.map((applicant, index) => (                       
                            <Card key={index} sx={{ my: 2 }} >
                                <CardContent sx={{ display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, justifyContent: 'space-between', alignItems: 'center' }}>
                                    <NextLink href={`/profile/${applicant.username}`}>
                                        <Typography color="text.secondary">@{applicant.username}</Typography>
                                    </NextLink>
                                    {applicationStatus && applicationStatus.find(o => o.applicant.username === applicant.username && o.accepted === null) ? (
                                        <Box>
                                            <IconButton 
                                                size="small" 
                                                color="success" 
                                                onClick={ async () => {
                                                    const newAppStatus = await handleApplicationResponse(jobId, applicant.username, true);
                                                    setApplicationStatus(prev => {
                                                        let newState = {...prev}
                                                        newState = newAppStatus;
                                                        return newState
                                                    });
                                                }}
                                            >
                                                <CheckCircleOutlineIcon />
                                            </IconButton>
                                            <IconButton 
                                                size="small" 
                                                color="error" 
                                                onClick={ async () => {
                                                    const newAppStatus = await handleApplicationResponse(jobId, applicant.username, false);
                                                    setApplicationStatus(prev => {
                                                        let newState = {...prev}
                                                        newState = newAppStatus;
                                                        return newState  
                                                    });
                                                }}
                                            >
                                                <CancelIcon />
                                            </IconButton>
                                        </Box> 
                                        ) :
                                        applicationStatus && applicationStatus.find(o => o.applicant.username === applicant.username && o.accepted === true) ? (
                                        <Typography color="#4caf50">Accepted</Typography> ) 
                                          : (
                                        <Typography color="#f44336">Declined</Typography> 
                                        )
                                    }
                                </CardContent>
                            </Card>
                        )) 
                            : <Typography variant="h6" sx={{ textAlign: 'center', p: 3 }}>No Applicants Yet!</Typography> 
                        }
                    </Box>
                </Box>
            </Modal>
        </>
    )
}