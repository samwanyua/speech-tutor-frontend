'use client';

import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Divider, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import { registerUser, loginUser } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (mode === 'signup') {
      const success = await registerUser(name, email, password);
      if (success) {
        setMessage('Account created! You can now log in.');
        setTimeout(() => setMode('login'), 1500);
      } else setMessage('Sign-up failed. Try again.');
    } else {
      try {
        const data = await loginUser(email, password);
        login(email, data.access_token);
        router.push('/dashboard');
      } catch {
        setMessage('Invalid login credentials');
      }
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Placeholder — later connect to FastAPI OAuth endpoints
    alert(`Social login with ${provider} coming soon!`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '90vh',
        backgroundColor: 'transparent',
        p: 2,
      }}
    >
      <Card
        sx={{
          width: 420,
          p: 3,
          borderRadius: 3,
          backgroundColor: 'rgba(255,255,255,0.25)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
        }}
      >
        <CardContent>
          <Typography variant="h5" textAlign="center" gutterBottom fontWeight={700}>
            {mode === 'signup' ? 'Create Your Account' : 'Welcome Back'}
          </Typography>

          {mode === 'signup' && (
            <TextField
              label="Full Name"
              fullWidth
              sx={{ mb: 2 }}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}

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

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{ py: 1, fontWeight: 600 }}
          >
            {mode === 'signup' ? 'Sign Up' : 'Log In'}
          </Button>

          {/* Switch between signup/login */}
          <Typography textAlign="center" sx={{ mt: 2 }}>
            {mode === 'signup' ? (
              <>
                Already have an account?{' '}
                <Button variant="text" onClick={() => setMode('login')}>
                  <strong>Log in</strong>
                </Button>
              </>
            ) : (
              <>
                Don’t have an account?{' '}
                <Button variant="text" onClick={() => setMode('signup')}>
                  Sign up
                </Button>
              </>
            )}
          </Typography>

          {/* Forgot Password (only on login mode) */}
          {mode === 'login' && (
            <Typography textAlign="center" sx={{ mt: 1 }}>
              <Button variant="text" onClick={() => router.push('/auth/reset-password')}>
                Forgot password?
              </Button>
            </Typography>
          )}

          <Divider sx={{ my: 3 }}>or continue with</Divider>

          {/* Social Logins */}
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={() => handleSocialLogin('Google')}
            >
              Google
            </Button>
            <Button
              variant="outlined"
              startIcon={<FacebookIcon />}
              onClick={() => handleSocialLogin('Facebook')}
            >
              Facebook
            </Button>
            <Button
              variant="outlined"
              startIcon={<GitHubIcon />}
              onClick={() => handleSocialLogin('GitHub')}
            >
              GitHub
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
