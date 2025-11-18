'use client';

import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Stack, Divider } from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { loginUser } from '@/utils/api';
import GoogleIcon from '@mui/icons-material/Google';
import GitHubIcon from '@mui/icons-material/GitHub';
import FacebookIcon from '@mui/icons-material/Facebook';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async () => {
    try {
      const data = await loginUser(email, password);
      login(data.access_token);
      setMessage('Login successful!');
      setIsError(false);
      setTimeout(() => router.push('/dashboard'), 1000);
    } catch (err: any) {
      setMessage(err?.message || 'Failed to login. Check credentials.');
      setIsError(true);
    }
  };

  const handleSocialLogin = (provider: string) => {
    window.location.href = `https://sauticare-backend.vercel.app/api/auth/oauth/${provider}`;
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card sx={{ width: 400, p: 3, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.85)' }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" gutterBottom>Login</Typography>

          {message && (
            <Card sx={{ mb: 2, backgroundColor: isError ? '#ffebee' : '#e8f5e9' }}>
              <CardContent>
                <Typography color={isError ? 'error' : 'success.main'} textAlign="center">
                  {message}
                </Typography>
              </CardContent>
            </Card>
          )}

          <TextField label="Email" fullWidth sx={{ mb: 2 }} value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Password" type="password" fullWidth sx={{ mb: 2 }} value={password} onChange={(e) => setPassword(e.target.value)} />
          
          <Button fullWidth variant="contained" onClick={handleSubmit}>Login</Button>
          <Button fullWidth variant="text" sx={{ mt: 1 }} onClick={() => router.push('/auth/signup')}>Create Account</Button>

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
