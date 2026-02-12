'use client';

import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button,
  MenuItem, Select, InputLabel, FormControl, IconButton, InputAdornment
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { registerUser, loginUser, SignupData } from '@/utils/api';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState<SignupData>({
    email: '',
    password: '',
    full_name: '',
    role: 'learner',
    language_preference: 'English',
    impairment_type: 'Cerebral Palsy',
    severity_level: 'Mild',
    date_of_birth: '',
  });

  const languages = ['English', 'Swahili'];
  const impairments = [
    'Cerebral Palsy',
    'Neurodevelopmental disorders',
    'Neurological disorders',
    'Multiple Sclerosis (MS)',
    'Parkinson’s Disease',
    'Autism Spectrum Disorder (ASD)',
    'Down Syndrome'
  ];
  const severityLevels = ['Mild', 'Moderate', 'Severe', 'Profound'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const data = await loginUser(form.email, form.password);
        localStorage.setItem('token', data.access_token);
        setMessage('Login successful!');
        setTimeout(() => router.push('/dashboard'), 1000);
      } else {
        await registerUser(form);
        setMessage('Signup successful!');
        setTimeout(() => setIsLogin(true), 1000);
      }
    } catch (err: any) {
      setMessage(err?.message || 'Operation failed');
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh' }}>
      <Card sx={{ width: 450, p: 3, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.85)' }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" gutterBottom>
            {isLogin ? 'Login' : 'Sign Up'}
          </Typography>

          {message && <Typography color="error" textAlign="center" sx={{ mb: 2 }}>{message}</Typography>}

          {!isLogin && (
            <TextField
              label="Full Name"
              name="full_name"
              fullWidth
              sx={{ mb: 2 }}
              value={form.full_name}
              onChange={handleChange}
            />
          )}

          <TextField
            label="Email"
            name="email"
            fullWidth
            sx={{ mb: 2 }}
            value={form.email}
            onChange={handleChange}
          />

          <TextField
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            fullWidth
            sx={{ mb: 2 }}
            value={form.password}
            onChange={handleChange}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {!isLogin && (
            <>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Language Preference</InputLabel>
                <Select
                  value={form.language_preference}
                  label="Language Preference"
                  onChange={(e) => handleSelectChange('language_preference', e.target.value)}
                >
                  {languages.map(lang => <MenuItem key={lang} value={lang}>{lang}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Impairment Type</InputLabel>
                <Select
                  value={form.impairment_type}
                  label="Impairment Type"
                  onChange={(e) => handleSelectChange('impairment_type', e.target.value)}
                >
                  {impairments.map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Severity Level</InputLabel>
                <Select
                  value={form.severity_level}
                  label="Severity Level"
                  onChange={(e) => handleSelectChange('severity_level', e.target.value)}
                >
                  {severityLevels.map(level => <MenuItem key={level} value={level}>{level}</MenuItem>)}
                </Select>
              </FormControl>

              <TextField
                label="Date of Birth"
                type="date"
                name="date_of_birth"
                fullWidth
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
                value={form.date_of_birth}
                onChange={handleChange}
              />
            </>
          )}

          <Button fullWidth variant="contained" onClick={handleSubmit}>
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>

          <Typography
            sx={{ mt: 2, textAlign: 'center', cursor: 'pointer', color: 'primary.main' }}
            onClick={() => { setIsLogin(!isLogin); setMessage(''); }}
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
