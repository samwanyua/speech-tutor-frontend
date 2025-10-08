'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import GuardianDashboard from '@/components/GuardianDashboard';

export default function DashboardPage() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        minHeight: '85vh',
        backgroundColor: 'transparent',
        p: 3,
      }}
    >
      <GuardianDashboard />
    </Box>
  );
}
