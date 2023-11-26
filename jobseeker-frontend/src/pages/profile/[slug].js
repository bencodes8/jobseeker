import axios from 'axios';
import * as React from 'react';
import { useRouter } from 'next/router';
import {
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions, 
    CardHeader, 
    CardContent,
    Chip,
    Grid,
    Link,
    Paper,
    Stack,
    Tab,
    Tabs, 
    Typography,
    IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import { ConnectButton } from '@/components/ConnectButton/ConnectButton';
import EditProfileModal from './EditProfileModal';
import AuthContext from '@/context/AuthContext';
import PropTypes from 'prop-types';
import { BACKEND_URL } from '@/constants/constants';

export default function ProfilePage({ userData, userBookmarks }) {
    const { user } = React.useContext(AuthContext);
    const { push } = useRouter();
    const [value, setValue] = React.useState(0);
    const [isEditProfileModalOpen, setEditProfileModalOpen] = React.useState(false);
    const [profileData, setProfileData] = React.useState(userData);

    const handleOpenEditProfileModal = () => {
        setEditProfileModalOpen(true);
      };
    
    const handleCloseEditProfileModal = (e, reason) => {
        if (reason && reason === 'backdropClick')
            return;
        setEditProfileModalOpen(false);
    }
      
    const handleChange = (e, newValue) => {
        setValue(newValue);
    }


    if (!userData) {
        return (
          <div>
            <h1>404 - User Not Found</h1>
          </div>
        );
      }
    
    React.useEffect(() => async () => {
        const { data } = await axios.get(`${BACKEND_URL}/api/user/${profileData.username}`)
        setProfileData(data);
    }, [user]);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <Card sx={{ marginTop: '1rem' }}>
                <CardHeader 
                    title={`${profileData.first_name} ${profileData.last_name} (${profileData.groups[0].name})`}
                    subheader={`@${profileData.username}`}
                />
                <CardContent sx={{ display: 'flex', justifyContent: 'space-between'}}>
                    <Typography variant="subtitle1">
                        {profileData.connections.length} connection(s)
                    </Typography>
                    {user && user.username === profileData.username ? null :
                        <ConnectButton userId={profileData.id} targetUsername={profileData.username} />
                    }
                </CardContent>
            </Card>
            <Card sx={{ position: 'relative', flexGrow: 1, marginTop: 2, marginBottom: 2, overflowY: 'auto' }}>
                <CardContent>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                    >
                        <Tab value={0} label="Profile" />
                        <Tab value={1} label="Connections" />
                        <Tab value={2} label="Bookmarks" />
                    </Tabs>
                        <TabPanel value={value} index={0}>
                            <Typography variant="h5" component="div">
                                About Me {user && profileData.username === user.username ? <IconButton onClick={handleOpenEditProfileModal}><EditIcon /></IconButton> : ''}
                            </Typography>
                            <EditProfileModal
                                isModalOpen={isEditProfileModalOpen}
                                handleCloseModal={handleCloseEditProfileModal}
                                profileData={profileData} 
                            />
                            <Typography variant="body1" component="p" sx={{ marginTop: 2 }}>
                                {profileData.about_me}
                            </Typography>
                            <Paper elevation={1} sx={{ position: 'absolute', bottom: 15 }}>
                                <Typography variant="h5" component="div">Interests ({profileData.interests.length})</Typography>
                                <Stack direction="row" spacing={1} sx={{ marginTop: 1}}>
                                    { profileData.interests ? profileData.interests.map((interest, index) => (
                                        <Chip key={index} label={interest.title} variant="outlined" />
                                    )) : 'No Interests Currently!'}
                                </Stack>
                            </Paper>
                        </TabPanel>
                        <TabPanel value={value} index={1} >
                            <Box sx={{ overflow: 'auto', maxHeight: '550px' }}>
                                {profileData ? profileData.connections.map((connection, index) => (
                                        <Card key={index} sx={{ display: 'flex', width: {xs: '100%', sm: '75%'}, mx: 'auto', my: 1 }}>
                                            <CardActionArea onClick={() => push(`/profile/${connection.username}`)}>
                                                <CardContent>
                                                    <Typography variant="h6">{connection.first_name} {connection.last_name}</Typography>
                                                    <Typography variant="subtitle1" color={connection.groups[0].name === 'Employer' ? 'primary' : 'secondary'}>{connection.groups[0].name}</Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                )) : 'User has no connections.'}  
                            </Box>  
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <Box sx={{ overflow: 'auto', maxHeight: '550px' }}>
                                <Grid container spacing={2} sx={{ flexDirection: 'row', justifyContent: { xs: 'center', md: 'flex-start'}, alignItems: 'center', marginBottom: 2 }}>
                                    {userBookmarks ? userBookmarks.map((job, index) => (
                                        <Grid key={index} item xs={12} md={4} lg={3}>
                                            <Card variant="outlined" sx={{ width: {md: 250} }}>
                                                <CardContent>
                                                    <Typography color="primary" sx={{ fontSize: '1rem' }}>{job.title}</Typography>
                                                    <Typography color="text.secondary">{job.creator.first_name} {job.creator.last_name}</Typography>
                                                    <Typography sx={{ fontSize: 12 }}>Posted on: {job.created_at}</Typography>
                                                    <Typography sx={{ fontSize: 12 }}>Applicants: {job.applicants.length}</Typography>
                                                </CardContent>
                                                <CardActions sx={{ display: 'flex', justifyContent: 'space-between'}}>
                                                    <Button variant="outlined" onClick={() => push(`/jobs/${job.id}`)}>
                                                        View
                                                    </Button>
                                                    <IconButton onClick={() => handleBookmark(job)}>
                                                        { user && !user.bookmarks.includes(job.id) ? <TurnedInNotIcon /> : <TurnedInIcon />} 
                                                    </IconButton>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    )) 
                                    : <Typography variant="h6">No Bookmarks Available</Typography>}
                                </Grid>
                            </Box>
                        </TabPanel>
                </CardContent>
            </Card>
        </Box>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tabpanel-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
}

export async function getStaticPaths() {
    const { data } = await axios.get(`${BACKEND_URL}/api/user/all`);
    return {
        paths: data.map((profile) => ({
            params: {
                slug: profile.username
            }
        })),
        fallback: true
    };
}

export async function getStaticProps({ params }) {
    let userData = null;
    let userBookmarks = null;

    try {
        const { data } = await axios.get(`${BACKEND_URL}/api/user/${params.slug}`)
        userData = data;

        const { data: userBookmarkData } = await axios.get(`${BACKEND_URL}/api/get-user-bookmarks?username=${params.slug}`)
        userBookmarks = userBookmarkData;
    } catch (err) {

    }
    return { props: { userData, userBookmarks } }
    
}
