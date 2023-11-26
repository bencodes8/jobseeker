import * as React from 'react';
import axios from 'axios';
import { 
    Box,
    Button,
    Chip,
    Stack,
    Paper,
    Typography
} from '@mui/material';
import { BACKEND_URL } from '@/constants/constants';
import AuthContext from '@/context/AuthContext';
import ApplicantModal from './ApplicantModal';

export default function JobPostingPage({ jobPostData: jobData }) {
    const { user, handleJobApplication } = React.useContext(AuthContext);
    const [applicantModalOpen, setApplicantModalOpen] = React.useState(false);
    const [applicationStatus, setApplicationStatus] = React.useState(null);
    const [jobPostData, setJobPostData] = React.useState(jobData);
    
    const handleApplicantModalOpen = () => {
        setApplicantModalOpen(true);
        fetchApplicationStatus();
    }

    const fetchApplicationStatus = async () => {
        const { data: applicationStatusResponse } = await axios.get(`${BACKEND_URL}/api/get-job-applicants?job_posting_id=${jobPostData.id}`);
        if (applicationStatusResponse) {
            setApplicationStatus(applicationStatusResponse);
        }   
      }

    const handleApplicantModalClose = (e, reason) => {
        if (reason && reason === 'backdropClick') {
            return;
        }
        setApplicantModalOpen(false);
    }

    React.useEffect(() => {
        fetchApplicationStatus();
    }, []);

    return (
        <Paper elevation={2} sx={{ height: '100%', p: 3 }}>
            <Typography variant="h4" color="primary" textAlign={'center'}>{jobPostData.title}</Typography>
            <Stack direction="row" spacing={1} sx={{ my: 1, display: 'flex', justifyContent: 'center' }}>
                { jobPostData.type_of_job ? jobPostData.type_of_job.map((type, index) => (
                    <Chip key={index} label={type.title} variant="outlined" />
                )) : 'No Interests Currently!'}
            </Stack>
            <Typography varaint="subtitle1" color="text.secondary" textAlign={'center'} my={1}>Posted by: {jobPostData.creator.first_name}</Typography>
            <Typography textAlign={'center'}>{jobPostData.created_at}</Typography>
            <Typography variant="subtitle1" sx={{ textAlign: {xs: 'center', md: 'left' }}}>Current Amount of Applicants: ({jobPostData.applicants.length})</Typography>
            {user ? (
                    applicationStatus !== null && applicationStatus.find(o => o.applicant.username === user.username && o.accepted === null) !== undefined ? 
                        <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                            <Chip label="Pending" />
                        </Box>
                    : applicationStatus !== null && applicationStatus.find(o => o.applicant.username === user.username && o.accepted === true) !== undefined ?
                        <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                            <Chip label="Accepted" color="success" />
                        </Box>
                    : applicationStatus !== null && applicationStatus.find(o => o.applicant.username === user.username && o.accepted === false) !== undefined ?
                        <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                            <Chip label="Declined" color="error" />
                        </Box>
                    :
                    ''
                ) : null}
            <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end '}, my: 1 }}>
            {user && user.groups[0].name === 'Seeker' ? ( jobPostData.applicants.some(obj => obj.hasOwnProperty('username') && obj.username === user.username) ? (<Button variant="contained" disabled sx={{ marginRight: 1 }}>Applied</Button> ) 
                                                      : (<Button variant="contained" sx={{ marginRight: 1 }} 
                                                                 onClick={async () => {
                                                                    const data = await handleJobApplication(jobPostData.id);
                                                                    setJobPostData(prev => ({
                                                                        ...prev,
                                                                        applicants: data.applicants
                                                                    }));
                                                                }}
                                                         >
                                                            Apply
                                                        </Button>)
                                                    ) : null}
             {user && user.groups[0].name === 'Employer' && user.username === jobPostData.creator.username ?
                <>
                    <Button variant="outlined" color="secondary" onClick={handleApplicantModalOpen}>Applicants</Button>
                    <ApplicantModal
                        isModalOpen={applicantModalOpen}
                        handleCloseModal={handleApplicantModalClose}
                        applicants={jobPostData.applicants}
                        jobId={jobPostData.id}
                        applicationStatus={applicationStatus}
                        setApplicationStatus={setApplicationStatus}
                    />
                </>
                :
                ''
            } 
            </Box>
            <Typography variant="h6" my={2}>Job Description</Typography>
            <hr />
            <Typography variant="body1" p={1}>{jobPostData.description}</Typography>
        </Paper>
    )
}

export async function getStaticPaths() {
    const { data } = await axios.get(`${BACKEND_URL}/api/all-jobs`);
    return {
        paths: data.map((jobPosting) => ({
            params: {
                id: String(jobPosting.id)
            }
        })),
        fallback: true
    };
}

export async function getStaticProps({ params }) {
    let jobPostData = null;

    try {
        const { data } = await axios.get(`${BACKEND_URL}/api/get-job?id=${params.id}`)
        jobPostData = data;
    } catch (err) {
        throw new Error('Unable to retrieve job posting data.');
    }
    return { props: { jobPostData } }
    
}