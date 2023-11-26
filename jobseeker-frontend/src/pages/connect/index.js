import axios from 'axios';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
    Box,
    Card,
    CardActions,
    CardActionArea,
    CardContent,
    useMediaQuery,
    Pagination,
    Stack,
    Typography
} from '@mui/material';
import { ConnectButton } from '@/components/ConnectButton/ConnectButton';
import AuthContext from '@/context/AuthContext';
import { BACKEND_URL } from '@/constants/constants';

export default function ConnectPage() {
    const { user } = React.useContext(AuthContext);
    const { push } = useRouter();
    const [currentPage, setCurrentPage] = React.useState(1);
    const [profiles, setProfiles] = React.useState(null);
    const [paginationCount, setPaginationCount] = React.useState(0);
    const isMdScreen = useMediaQuery('(min-width: 600px)');

    React.useEffect(() => {
        async function fetchUsers() {
            const PAGINATION_SIZE = 5;

            const { data } = await axios.get(`${BACKEND_URL}/api/connect/users?page=${currentPage}&username=${user?.username}`);
            setProfiles(data.items);
            setPaginationCount(Math.ceil(data.count / PAGINATION_SIZE));
        }

        fetchUsers();
    }, [currentPage, user]);

    return (
        <Box sx={{ display: 'flex', flexDirection: {xs: 'column', md: 'row'}, justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Box sx={{ mb: 1, display: {xs: 'none', md: 'block' }}}>
                <Typography variant="h6">Connect with others!</Typography>
                <Typography color="text.secondary">Click on a user below to view their profile!</Typography>
            </Box>
            <Stack spacing={2} sx={{ height: '554px', width: '100%', alignItems: 'center' }}>
                {profiles ? profiles.map((profile, index) => (
                    <Card key={index} sx={{ display: 'flex', width: {xs: '100%', sm: '75%'}, }}>
                            <CardActionArea onClick={() => push(`/profile/${profile.username}`)}>
                                <CardContent>
                                    <Typography variant="h6">{profile.first_name} {profile.last_name}</Typography>
                                    <Typography variant="subtitle1" color={profile.groups[0].name === 'Employer' ? "primary" : "secondary"}>{profile.groups[0].name}</Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <ConnectButton userId={profile.id} targetUsername={profile.username} />
                            </CardActions>
                    </Card>
                )) : 'No users to be found!'}
            </Stack>
            <Pagination count={paginationCount} onChange={(e, page) => setCurrentPage(page)} sx={{ display: 'flex', position: 'absolute', bottom: 10 }} />
        </Box>
    );
}