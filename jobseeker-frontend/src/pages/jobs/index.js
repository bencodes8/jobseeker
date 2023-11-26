import * as React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { 
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Checkbox,
    FormControlLabel,
    Grid,
    InputAdornment,
    IconButton,
    Paper,
    TextField,
    Typography 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import { BACKEND_URL } from '@/constants/constants';
import AuthContext from '@/context/AuthContext';
import CreateJobPostModal from './CreateJobPostModal';

export default function JobsPage ({ allJobPostings }) {
    const { user, setUser, accessToken } = React.useContext(AuthContext);
    const router = useRouter();
    const [interestsFilters, setInterestFilters] = React.useState(null);
    const [isCreateJobPostModalOpen, setIsCreateJobPostModalOpen] = React.useState(false);
    const [jobPostings, setJobPostings] = React.useState(allJobPostings);
    const [searchFields, setSearchFields] = React.useState({
        search: '',
        filters: []
    });

    React.useEffect(() => {
        const getInterests = async () => {
            const { data: interestsResponse } = await axios.get(`${BACKEND_URL}/api/interests/all`);
            if (interestsResponse) setInterestFilters(interestsResponse);
            if (user?.interests) {
                user.interests.forEach((interest) => setSearchFields(prevFields => ({
                    ...prevFields,
                    filters: [...prevFields.filters, interest.title]
                })))
            }
        }
        getInterests();
    }, []);

    const handleOpenModal = () => {
        setIsCreateJobPostModalOpen(true);
    }

    const handleCloseModal = (e, reason) => {
        if (reason && reason === 'backdropClick')
            return;
        setIsCreateJobPostModalOpen(false);
    }

    const handleCheckboxChange = (e, interest) => {
        const isChecked = e.target.checked;
        if (isChecked) {
            setSearchFields(prevFields => ({
                ...prevFields,
                filters: [...prevFields.filters, interest.title]
            }));
        } else {
            setSearchFields((prevFields) => ({
                ...prevFields,
                filters: prevFields.filters.filter((filter) => filter !== interest.title),
            }));
        }
    }

    const handleBookmark = async (job) => {
        if (!accessToken) {
            router.push('/auth/login');
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
        const { data } = await axios.put(`${BACKEND_URL}/api/jobs?bookmark_id=${job.id}`, null, config)
        setUser(data);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        let resultingFilters = '';
        for (let i = 0; i < searchFields.filters.length; i++) {
            resultingFilters += `&filter=${searchFields.filters[i]}`;
        }

        const { data: searchResponse } = await axios.get(`${BACKEND_URL}/api/jobs?search=${searchFields.search}${resultingFilters}`);
        setJobPostings(searchResponse);
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', paddingY: 3 }}>
            <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6">View Jobs</Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-around', marginY: 2 }}>
                        <TextField
                                label="Search"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    )
                                }}
                                fullWidth
                                autoFocus
                                onChange={(e) => setSearchFields({...searchFields, search: e.target.value})} 
                            />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">Filtering</Typography>
                        <Typography vairant="subtitle2" color="text.secondary" sx={{ display: {xs: 'none', md: 'block'}}}>If logged in, your interests are already filtered for you!</Typography>
                    </Box>
                    { interestsFilters && interestsFilters.map((interest, index) => (
                        <FormControlLabel key={index} 
                            control={
                                <Checkbox 
                                    defaultChecked={(user && user.interests.some(obj => obj.hasOwnProperty('title') && obj.title === interest.title)) || router.query.filter === interest.title ? true : false}
                                    onChange={(e) => handleCheckboxChange(e, interest)}
                                />
                            } 
                            label={interest.title} 
                        />
                    ))}
                </form>
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 3, alignItems: 'center'}}>
                <Typography variant="h6" >Job Listings ({jobPostings ? jobPostings.length : 0})</Typography>
                <Button variant="outlined" disabled={!user || user && user.groups[0].name !== 'Employer' ? true : false}
                    onClick={handleOpenModal}
                >
                    Create Job Post
                </Button>
                <CreateJobPostModal
                    isModalOpen={isCreateJobPostModalOpen}
                    handleCloseModal={handleCloseModal}
                    interestsFilters={interestsFilters}
                    setJobPostings={setJobPostings}
                />
            </Box>
            <Box sx={{ flexGrow: 1, px: 3 }}>
                <Grid container spacing={2} sx={{ flexDirection: 'row', justifyContent: { xs: 'center', md: 'flex-start'}, alignItems: 'center', marginBottom: 2 }}>
                    {jobPostings ? jobPostings.map((job, index) => (
                        <Grid key={index} item xs={12} md={4} lg={3}>
                            <Card variant="outlined" sx={{ width: {md: 250} }}>
                                <CardContent>
                                    <Typography color="primary" sx={{ fontSize: '1rem' }}>{job.title}</Typography>
                                    <Typography color="text.secondary">{job.creator.first_name} {job.creator.last_name}</Typography>
                                    <Typography sx={{ fontSize: 12 }}>Posted on: {job.created_at}</Typography>
                                    <Typography sx={{ fontSize: 12 }}>Applicants: {job.applicants.length}</Typography>
                                </CardContent>
                                <CardActions sx={{ display: 'flex', justifyContent: 'space-between'}}>
                                    <Button variant="outlined" onClick={() => router.push(`/jobs/${job.id}`)}>
                                        View
                                    </Button>
                                    <IconButton onClick={() => handleBookmark(job)}>
                                        { user ? (!user.bookmarks.includes(job.id) ? <TurnedInNotIcon /> : <TurnedInIcon />) : <TurnedInNotIcon />} 
                                    </IconButton>
                                </CardActions>
                            </Card>
                        </Grid>
                    )) 
                    : <Typography variant="h6">No Jobs Available</Typography>}
                </Grid>
            </Box>
        </Box>
    );
}

export async function getServerSideProps() {
    const { data: allJobPostings } = await axios.get(`${BACKEND_URL}/api/all-jobs`);
    return { props: { allJobPostings }};
}