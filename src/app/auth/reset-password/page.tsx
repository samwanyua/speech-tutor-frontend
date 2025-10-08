'use client';
import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button } from '@mui/material';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');

  const handleReset = () => {
    alert(`Password reset link sent to ${email}`);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh' }}>
      <Card sx={{ width: 400, p: 3, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.25)', backdropFilter: 'blur(8px)' }}>
        <CardContent>
          <Typography variant="h5" textAlign="center" fontWeight={600} gutterBottom>
            Reset Password
          </Typography>
          <TextField
            label="Enter your email"
            fullWidth
            sx={{ mb: 2 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button fullWidth variant="contained" onClick={handleReset}>
            Send Reset Link
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
