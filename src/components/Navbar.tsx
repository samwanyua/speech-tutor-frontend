// src/app/components/Navbar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '@/context/AuthContext';

export default function Navbar(): JSX.Element {
  const router = useRouter();
  const { user, logout } = useAuth(); // <-- from AuthContext
  const [lessonsAnchor, setLessonsAnchor] = useState<null | HTMLElement>(null);

  const openLessonsMenu = (event: React.MouseEvent<HTMLElement>) => setLessonsAnchor(event.currentTarget);
  const closeLessonsMenu = () => setLessonsAnchor(null);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <AppBar
      position="sticky"
      elevation={1}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(6px)',
        color: '#222',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 64 }}>
        
        {/* === Left: Brand (Home + Title) === */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 1, md: 1.5 }, // smaller gaps on small screens
          }}
        >
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
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }, // responsive text size
                whiteSpace: 'nowrap', // prevent wrapping
              }}
            >
              SautiCare
            </Typography>
          </Link>
        </Box>


        {/* === Right: Nav Actions === */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          
          {/* Lessons Dropdown */}
          <Button
            onClick={openLessonsMenu}
            aria-controls={lessonsAnchor ? 'lessons-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={Boolean(lessonsAnchor) ? 'true' : undefined}
            sx={{
              textTransform: 'none',
              fontWeight: 700,
              color: '#000',
              '&:hover': {
                backgroundColor: 'rgba(71, 70, 70, 0.04)',
                color: '#000',
              },
            }}
          >
            Lessons
          </Button>

          <Menu
            id="lessons-menu"
            anchorEl={lessonsAnchor}
            open={Boolean(lessonsAnchor)}
            onClose={closeLessonsMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
          >
            {['easy', 'medium', 'hard'].map((level) => (
              <MenuItem key={level} onClick={closeLessonsMenu}>
                <Link
                  href={`/lessons/${level}`}
                  style={{ textDecoration: 'none', color: 'black', width: '100%' }}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Link>
              </MenuItem>
            ))}
          </Menu>

          {/* Profile */}
          <Link href="/profile" style={{ textDecoration: 'none' }}>
            <Button sx={{ textTransform: 'none', fontWeight: 700, color: '#000' }}>Profile</Button>
          </Link>

          {/* Dashboard (teacher/guardian) */}
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <Button sx={{ textTransform: 'none', fontWeight: 700 }}>Dashboard</Button>
          </Link>


         {/* Conditional Auth Buttons */}
        {user ? (
          <>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <Button
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  color: '#000',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
                }}
              >
                Dashboard
              </Button>
            </Link>

            <Button
              onClick={handleLogout}
              sx={{
                textTransform: 'none',
                fontWeight: 700,
                color: '#000',
                '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
              }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
              <Button
                variant="contained"
                sx={{
                  textTransform: 'none',
                  fontWeight: 700,
                  borderRadius: '20px',
                  color: '#FFF',
                  '&:hover': {
                    backgroundColor: 'rgba(0,0,0,0.05)',
                    borderColor: '#000',
                  },
                }}
              >
                Sign Up
              </Button>
            </Link>
          </>
        )}

          {/* Mobile Menu (optional) */}
          <IconButton
            edge="end"
            aria-label="menu"
            sx={{ display: { xs: 'inline-flex', sm: 'none' }, ml: 1, color: '#000' }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
