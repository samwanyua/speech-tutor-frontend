// src/app/components/Navbar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import HomeIcon from '@mui/icons-material/Home';
import MenuIcon from '@mui/icons-material/Menu';

export default function Navbar(): JSX.Element {
  const [lessonsAnchor, setLessonsAnchor] = useState<null | HTMLElement>(null);

  const openLessonsMenu = (event: React.MouseEvent<HTMLElement>) => {
    setLessonsAnchor(event.currentTarget);
  };

  const closeLessonsMenu = () => {
    setLessonsAnchor(null);
  };

  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.85)', 
        backdropFilter: 'blur(6px)',
        color: '#222',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 64 }}>
        {/* Left: Brand (Home icon + SautiCare) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'black' }}>
            {/* <HomeIcon fontSize="large" aria-hidden /> */}
            <Typography variant="h6" component="span" sx={{ ml: 0.5, fontWeight: 700 }}>
              SautiCare
            </Typography>
          </Link>
        </Box>

        {/* Right: Nav actions (max ~4 items) */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'black'}}>
          {/* Lessons menu (Easy / Medium / Hard) */}
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
            <MenuItem onClick={closeLessonsMenu}>
              <Link href="/lessons/easy" style={{ textDecoration: 'none', color: 'black' }}>
                Easy
              </Link>
            </MenuItem>
            <MenuItem onClick={closeLessonsMenu}>
              <Link href="/lessons/medium" style={{ textDecoration: 'none', color: 'black' }}>
                Medium
              </Link>
            </MenuItem>
            <MenuItem onClick={closeLessonsMenu}>
              <Link href="/lessons/hard" style={{ textDecoration: 'none', color: 'black' }}>
                Hard
              </Link>
            </MenuItem>
          </Menu>

          {/* Profile */}
          <Link href="/profile" style={{ textDecoration: 'none' }}>
            <Button sx={{ textTransform: 'none', fontWeight: 700, color: '#000' }}>Profile</Button>
          </Link>

          {/* Dashboard (teacher/guardian) */}
          <Link href="/dashboard" style={{ textDecoration: 'none' }}>
            <Button sx={{ textTransform: 'none', fontWeight: 700, color: '#000',  }}>Dashboard</Button>
          </Link>

          {/* Small-screen fallback: optional hamburger (keeps UI stable on tiny screens) */}
          <IconButton
            edge="end"
            aria-label="menu"
            sx={{ display: { xs: 'inline-flex', sm: 'none' }, ml: 1 }}
          >
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
