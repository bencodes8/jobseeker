import Head from 'next/head';
import { Container } from '@mui/material';
import { AuthProvider } from '@/context/AuthContext';
import ThemeRegistry from '@/components/Theme/ThemeRegistery';
import Navbar from '@/components/Navbar/Navbar';

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ThemeRegistry>
        <Head>
          <title>Jobseeker App</title>
        </Head>
        <Navbar />
        <Container sx={{ height: {xs: 'calc(100vh - 56px)', sm: 'calc(100vh - 4rem)'}, 
                                marginTop: {xs: '56px', sm: '4rem'}, 
                              }}
        >
          <Component {...pageProps} />
        </Container>
      </ThemeRegistry>
    </AuthProvider>
  );
}
