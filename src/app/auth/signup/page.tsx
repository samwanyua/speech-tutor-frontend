'use client';

import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Divider, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/utils/api';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async () => {
    try {
      const success = await registerUser(name, email, password);
      if (success) {
        setMessage('Account created! Redirecting to login...');
        setIsError(false);
        setTimeout(() => router.push('/auth/login'), 1500);
      } else {
        setMessage('Sign-up failed. Try again.');
        setIsError(true);
      }
    } catch (err: any) {
      setMessage(err?.message || 'Sign-up failed. Try again.');
      setIsError(true);
    }
  };

  const handleSocialLogin = (provider: string) => {
    window.location.href = `https://sauticare-backend.vercel.app/api/auth/oauth/${provider}`;
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', p: 2 }}>
      <Card sx={{ width: 420, p: 3, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(10px)' }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" gutterBottom fontWeight={700}>Create Your Account</Typography>

          {message && (
            <Card sx={{ mb: 2, backgroundColor: isError ? '#ffebee' : '#e8f5e9' }}>
              <CardContent>
                <Typography color={isError ? 'error' : 'success.main'} textAlign="center">
                  {message}
                </Typography>
              </CardContent>
            </Card>
          )}

          <TextField label="Full Name" fullWidth sx={{ mb: 2 }} value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Email" fullWidth sx={{ mb: 2 }} value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Password" type="password" fullWidth sx={{ mb: 2 }} value={password} onChange={(e) => setPassword(e.target.value)} />

          <Button fullWidth variant="contained" onClick={handleSubmit} sx={{ py: 1, fontWeight: 600 }}>Sign Up</Button>

          <Typography textAlign="center" sx={{ mt: 1 }}>
            Already have an account?{' '}
            <Button
              variant="text"
              sx={{ p: 0, minWidth: 'auto', textTransform: 'none', fontWeight: 600, fontSize:16 }}
              onClick={() => router.push('/auth/login')}
            >
              Log in
            </Button>
          </Typography>

          <Divider sx={{ my: 3 }}>or continue with</Divider>

          <Stack direction="row" spacing={2} justifyContent="center">
            <Button variant="outlined" startIcon={<GoogleIcon />} onClick={() => handleSocialLogin('google')}>Google</Button>
            <Button variant="outlined" startIcon={<FacebookIcon />} onClick={() => handleSocialLogin('facebook')}>Facebook</Button>
            <Button variant="outlined" startIcon={<GitHubIcon />} onClick={() => handleSocialLogin('github')}>GitHub</Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
