// src/components/Navbar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Menu,
  MenuItem,
  Box,
  Avatar,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SchoolIcon from '@mui/icons-material/School';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const openProfileMenu = (event: React.MouseEvent<HTMLElement>) =>
    setProfileAnchor(event.currentTarget);
  const closeProfileMenu = () => setProfileAnchor(null);

  // Navigation items based on user role
  const navItems = [
    { label: 'Lessons', href: '/lessons', icon: <SchoolIcon />, show: !!user },
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: <DashboardIcon />,
      show: !!user,
    },
    {
      label: 'Analytics',
      href: '/analytics',
      icon: <BarChartIcon />,
      show: !!user && user.role === 'learner',
    },
  ];

  return (
    <>
      <AppBar
        position="sticky"
        elevation={1}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(6px)',
          color: '#222',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minHeight: 64,
          }}
        >
          {/* Logo/Brand */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: 'black',
            }}
          >
            <Typography
              variant="h6"
              component="span"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                whiteSpace: 'nowrap',
              }}
            >
              SautiCare
            </Typography>
          </Link>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
            {navItems
              .filter((item) => item.show)
              .map((item) => (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                  <Button
                    startIcon={item.icon}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      color: '#000',
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
                    }}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}

            {/* Auth Section */}
            {loading ? (
              <Box sx={{ width: 100, height: 36 }} /> // Placeholder while loading
            ) : user ? (
              <>
                <Tooltip title="Account">
                  <IconButton onClick={openProfileMenu} size="small">
                    <Avatar
                      sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                    >
                      {user.full_name?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                </Tooltip>

                <Menu
                  anchorEl={profileAnchor}
                  open={Boolean(profileAnchor)}
                  onClose={closeProfileMenu}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                  <MenuItem
                    onClick={() => {
                      closeProfileMenu();
                      router.push('/profile');
                    }}
                  >
                    <ListItemIcon>
                      <PersonIcon fontSize="small" />
                    </ListItemIcon>
                    Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Link href="/auth/login" style={{ textDecoration: 'none' }}>
                  <Button
                    startIcon={<LoginIcon />}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      color: '#000',
                    }}
                  >
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
                  <Button
                    variant="contained"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: '20px',
                    }}
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            edge="end"
            onClick={toggleMobileMenu}
            sx={{ display: { xs: 'inline-flex', md: 'none' }, color: '#000' }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileMenuOpen} onClose={toggleMobileMenu}>
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            {navItems
              .filter((item) => item.show)
              .map((item) => (
                <ListItem
                  key={item.href}
                  component={Link}
                  href={item.href}
                  onClick={toggleMobileMenu}
                  sx={{
                    color: '#000',
                    textDecoration: 'none',
                    '&:hover': { bgcolor: 'rgba(0,0,0,0.05)' },
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}

            {user ? (
              <>
                <ListItem
                  component={Link}
                  href="/profile"
                  onClick={toggleMobileMenu}
                >
                  <ListItemIcon>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem
                  component={Link}
                  href="/auth/login"
                  onClick={toggleMobileMenu}
                >
                  <ListItemIcon>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItem>
                <ListItem
                  component={Link}
                  href="/auth/signup"
                  onClick={toggleMobileMenu}
                >
                  <ListItemText primary="Sign Up" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}