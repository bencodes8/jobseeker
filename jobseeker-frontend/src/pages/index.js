import * as React from 'react';
import { useMediaQuery } from '@mui/material';
import axios from 'axios';
import { BACKEND_URL } from '@/constants/constants';
import { 
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Fade, 
  Grid,
  Link,
  Paper,
  Stack,
  Typography,
  Zoom
} from '@mui/material';
import AuthContext from '@/context/AuthContext';

export default function Home({ jobQueries }) {
  const { user } = React.useContext(AuthContext);
  const isLargeScreen = useMediaQuery('(min-width: 950px)');

  return (
    <Box sx={{ display: 'flex', 
              flexDirection: 'column', 
              height: '100%' 
            }}
    >
      <Box sx={{ textAlign: 'center', boxSizing: 'border-box', padding: 2 }}>
        <Fade in timeout={2000}>
          <Typography variant="h4">Welcome {user?.first_name ? `back, ${user?.first_name}!` : 'to Jobseeker'}</Typography>
        </Fade>
        <Fade in style={{ transitionDelay: '500ms' }} timeout={2000}>
          <Typography variant="subtitle1" sx={{ marginTop: 1 }}>Seeking a job? Click on a card for a quick search.</Typography>
        </Fade>
      </Box>
      {isLargeScreen ? ( 
        <Grid container spacing={3}>
          {jobQueries.map((job, index) => (
              <Grid key={`${job}-${index}`} item xs={4}>
                <Zoom in style={{ transitionDelay: `${125 * (index + 1)}ms`}}>
                <Link href={`/jobs?filter=${job.title}`} sx={{ textDecoration: 'none' }}>
                  <Card sx={{ maxWidth: 325, margin: 'auto' }}>
                    <Paper elevation={4}>
                      <CardActionArea>
                        <CardMedia 
                          component="img"
                          height="150"
                          image={`${BACKEND_URL}/${job.image}`}
                        />
                        <CardContent>
                          <Typography gutterBottom variant="h5" component="div" textAlign={'center'}>
                            {job.title}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Paper>
                  </Card>
                  </Link>
                </Zoom>
              </Grid>
          ))}
        </Grid>
      ) : ( 
        <Stack spacing={3} sx={{ flexGrow: 1, justifyContent: 'center' }}>
          {jobQueries.map((job, index) => (
            <Zoom key={index} in style={{ transitionDelay: `${100 * (index + 1)}ms`}}>
              <Card>
                <CardActionArea>
                  <Link href={`/jobs?filter=${job.title}`} sx={{ textDecoration: 'none' }}>
                  <CardContent>
                    <Typography variant="h6">{job.title}</Typography>
                  </CardContent>
                  </Link>
                </CardActionArea>
              </Card>

            </Zoom>
          ))}
        </Stack>
      )}
    </Box>
  );
}


export async function getStaticProps() {
  const { data: jobQueries } = await axios.get(`${BACKEND_URL}/api/index`);
  return { props: { jobQueries } };
}