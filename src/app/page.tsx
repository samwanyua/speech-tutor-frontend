// src/app/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardContent, Typography, Box } from '@mui/material';

export default function Home() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0)', // transparent white card
        backdropFilter: 'blur(8px)',
        padding: 3,
      }}
    >
      {/* Main Card */}
      <Card
        elevation={3}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: 900,
          width: '100%',
          borderRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.1)', // transparent white card
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Left section: text content */}
        <CardContent sx={{ flex: 1, textAlign: 'left', p: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: '#1a1a1a',
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            SautiCare
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontSize: '1.1rem',
              color: '#333',
              lineHeight: 1.7,
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            SautiCare is a speech tutor app for learners with speech impairments.
            Through simple nutrition and hygiene lessons, it helps students
            practice speech, gain confidence, and build everyday life skills.
          </Typography>
        </CardContent>

        {/* Right section: image */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 2,
          }}
        >
          <Image
            src="/images/home_page_ill-removebg-preview.png"
            alt="Dashboard Illustration"
            width={400}
            height={300}
            style={{
              borderRadius: '12px',
              objectFit: 'cover',
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        </Box>
      </Card>
    </Box>
  );
}
