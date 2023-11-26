import * as React from 'react';
import { NavLink } from '@/assets/NavLink';
import { NextLink } from '@/assets/NextLink';
import {
  AppBar,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import WorkIcon from '@mui/icons-material/Work';
import GroupsIcon from '@mui/icons-material/Groups';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import AuthContext from '@/context/AuthContext';

export default function Navbar() {
    // Navbar
    const { user, logoutUser } = React.useContext(AuthContext);
    const theme = useTheme();
    const isWideScreen = useMediaQuery(theme.breakpoints.up('md'));
    const PAGES = [
        {title: 'Home', icon: <HomeIcon />, href: "/"},
        {title: 'Seek Jobs', icon: <WorkIcon />, href: "/jobs" },
        {title: 'Connect', icon: <GroupsIcon />, href: "/connect" },
        user && {title: user.first_name, icon: <AccountCircleIcon />, href: `/profile/${user.username}`},
    ].filter(Boolean);

    const PAGE_LINKS = PAGES.map((page) => (
        <NextLink key={page.title} href={page.href}>
          <Button sx={{ letterSpacing: 1.5, marginRight: 1, color: 'white' }}>
            {page.icon}&nbsp;{page.title}
          </Button>
        </NextLink>
      ));

    //Sidebar
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    const Sidebar = (
        <>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 0.5 }}
                onClick={handleDrawerOpen}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                anchor="top"
                onClose={handleDrawerClose}
                open={open}
            >
                <Box
                    sx={{ width: 'auto' }}
                    role="presentation"
                    onClick={handleDrawerClose}
                >
                    <List>
                        {PAGES.map((page, index) => (
                            <ListItem key={index} disablePadding>
                                <NavLink href={page.href}>
                                    <ListItemButton>
                                        {page.icon}&nbsp;<ListItemText color='inherit'>{page.title}</ListItemText>
                                    </ListItemButton>
                                </NavLink>
                            </ListItem>
                        ))}
                        {!user ?
                            <NavLink href="/auth/login">
                                <ListItemButton>
                                    <LoginIcon />&nbsp;Login
                                </ListItemButton>
                            </NavLink> :
                            <ListItemButton onClick={logoutUser}>
                                <LogoutIcon />&nbsp;Logout
                            </ListItemButton>
                        }
                    </List>
                </Box>
            </Drawer>
        </>
    );

    return (
        <AppBar position="fixed">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ letterSpacing: 1.5 }}>
                    Jobseeker {user ? `| ${user.groups[0].name}` : ''}
                </Typography>
                {isWideScreen ? 
                    <Box sx={{ flexGrow: 1, 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        marginRight: 2.5 
                        }}
                    >
                    {PAGE_LINKS}
                    { !user ? 
                        <NextLink href="/auth/login">
                            <Button variant="outlined">
                                <LoginIcon />&nbsp;Login
                            </Button>
                        </NextLink>  
                        :
                        <Button variant="outlined" onClick={logoutUser}>
                            <LogoutIcon />&nbsp;Logout
                        </Button> 
                    }
                    </Box> : 
                    <Box sx={{ flexGrow: 1, 
                        display: 'flex', 
                        justifyContent: 'flex-end', 
                        marginRight: 1 
                        }}
                    >
                        {Sidebar}
                    </Box>
                }
            </Toolbar>
        </AppBar>
    );
}
