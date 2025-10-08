// src/app/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Grid,
  Container,
  Divider,
} from '@mui/material';

export default function Home() {
  return (
    <Box
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0)', // transparent white card
        backdropFilter: 'blur(8px)',
        minHeight: '100vh',
        py: 6,
      }}
    >
      {/* ================= HERO SECTION ================= */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Card
          elevation={3}
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            borderRadius: 4,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(8px)',
            p: 3,
          }}
        >
          {/* Left content */}
          <CardContent sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
            <Typography variant="h3" fontWeight={700} color="primary" gutterBottom>
              SautiCare
            </Typography>
            <Typography variant="body1" sx={{ color: '#333', lineHeight: 1.7, mb: 3 }}>
              SautiCare is a speech tutor app for learners with speech impairments.
              Through simple nutrition and hygiene lessons, it helps students
              practice speech, gain confidence, and build everyday life skills.
            </Typography>

            <Button
              variant="contained"
              color="primary"
              size="large"
              component={Link}
              href="/profile"
              sx={{
                borderRadius: '24px',
                textTransform: 'none',
                px: 4,
                py: 1.5,
                fontWeight: 600,
              }}
            >
              Get Started
            </Button>
          </CardContent>

          {/* Right image */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: { xs: 3, md: 0 },
            }}
          >
            <Image
              src="/images/slt-1.png"
              alt="Dashboard Illustration"
              width={420}
              height={320}
              style={{
                borderRadius: '16px',
                objectFit: 'cover',
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </Box>
        </Card>
      </Container>

     {/* ================= FEATURE CARDS SECTION ================= */}
      <Container
        maxWidth="lg"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight={600}
          gutterBottom
          sx={{ mb: 4 }}
        >
          Explore SautiCare
        </Typography>

        {/* Grid container */}
        <Grid
          container
          spacing={4}
          justifyContent="center"
          alignItems="center"
          sx={{ maxWidth: 1200 }} // keeps layout tight & centered
        >
          {[
            {
              title: 'Lessons',
              description:
                'Practice speaking through nutrition and hygiene phrases. Learn at your own pace with easy, medium, and hard levels.',
              link: '/lessons/easy',
              button: 'Start Learning',
            },
            {
              title: 'Learner Profile',
              description:
                'Set up your voice baseline and personalize the learning experience for accurate speech recognition and adaptive feedback.',
              link: '/profile',
              button: 'Set Up Profile',
            },
            {
              title: 'Guardian Dashboard',
              description:
                'View progress, listen to past attempts, and discover personalized recommendations for each learner.',
              link: '/dashboard',
              button: 'View Dashboard',
            },
            // {
            //   title: 'Offline Mode',
            //   description:
            //     'Keep learning even without internet access. Your progress will sync automatically once reconnected.',
            //   link: '/offline',
            //   button: 'Go Offline',
            // },
          ].map((card, index) => (
            <Grid
              key={index}
              item
              xs={12}
              sm={6} // two cards per row on small+ screens
              md={6}
              sx={{
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <Card
                elevation={3}
                sx={{
                  width: 420,
                  height: 240, 
                  borderRadius: 3,
                  backgroundColor: 'rgba(255, 255, 255, 0.35)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
                  },
                }}
              >
                <CardContent
                  sx={{
                    textAlign: 'center',
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '100%',
                  }}
                >
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                      {card.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: '#555', mb: 3, lineHeight: 1.6 }}
                    >
                      {card.description}
                    </Typography>
                  </Box>

                  <Button
                    variant="outlined"
                    component={Link}
                    href={card.link}
                    sx={{
                      borderRadius: '20px',
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    {card.button}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>



      {/* ================= FOOTER ================= */}
      <Divider sx={{ my: 6 }} />
     <Box sx={{ textAlign: 'center', mt: 6, mb: 2 }}>
        <Typography variant="body2" sx={{ color: 'primary' }}>
          © {new Date().getFullYear()} <strong>SautiCare</strong> · Empowering Speech, Inspiring Growth
        </Typography>
        <Typography variant="body2" sx={{ color: 'primary', mt: 0.5 }}>
          Made by{' '}
          <a
            href="https://www.datascienceportfol.io/samuelwanyua"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#000', fontWeight: 600, textDecoration: 'none' }}
          >
            Samuel Wanyua
          </a>
        </Typography>

      </Box>

    </Box>
  );
}
