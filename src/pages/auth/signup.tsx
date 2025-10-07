// src/app/auth/signup.tsx
'use client';

import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/utils/api';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async () => {
    const success = await registerUser(name, email, password);
    if (success) {
      setMessage('Account created! You can now log in.');
      setTimeout(() => router.push('/auth/login'), 1500);
    } else setMessage('Sign-up failed. Try again.');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh', // full height ensures background fills screen
        backgroundColor: 'transparent', // do not override body bg
        p: 2,
      }}
    >
      <Card
        sx={{
          width: 400,
          p: 3,
          borderRadius: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.2)', // translucent so bg shows through
          backdropFilter: 'blur(10px)', // frosted glass effect
          boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
        }}
      >
        <CardContent>
          <Typography variant="h5" textAlign="center" gutterBottom fontWeight={600}>
            Sign Up
          </Typography>

          <TextField
            label="Full Name"
            fullWidth
            sx={{ mb: 2 }}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Email"
            fullWidth
            sx={{ mb: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            sx={{ mb: 2 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {message && (
            <Typography textAlign="center" color="primary" sx={{ mb: 2 }}>
              {message}
            </Typography>
          )}

          <Button fullWidth variant="contained" onClick={handleSignup}>
            Create Account
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
