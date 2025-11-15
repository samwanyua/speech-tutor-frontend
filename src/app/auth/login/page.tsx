// src/app/auth/login.tsx
'use client';

import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { loginUser } from '@/utils/api';


export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const data = await loginUser(email, password);
      login(email, data.access_token);
      router.push('/dashboard');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card sx={{ width: 400, p: 3, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.85)' }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" gutterBottom>Login</Typography>
          <TextField label="Email" fullWidth sx={{ mb: 2 }} value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Password" type="password" fullWidth sx={{ mb: 2 }} value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
          <Button fullWidth variant="contained" onClick={handleSubmit}>Login</Button>
          <Button fullWidth variant="text" sx={{ mt: 1 }} onClick={() => router.push('/auth/signup')}>
            Create Account
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
