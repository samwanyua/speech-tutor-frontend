'use client';

import React from 'react';
import { Card, CardContent, Typography, LinearProgress, Button } from '@mui/material';
import Link from 'next/link';

export default function LearnerCard({ learner }: { learner: any }) {
  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.3)',
        backdropFilter: 'blur(6px)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
        },
      }}
    >
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {learner.name}
        </Typography>

        <Typography variant="body2" sx={{ mb: 1 }}>
          Lessons Completed: {learner.lessonsCompleted}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={learner.progress}
          sx={{ height: 8, borderRadius: 5, mb: 2 }}
        />
        <Typography variant="body2" sx={{ mb: 2 }}>
          Progress: {learner.progress}%
        </Typography>

        <Link href={`/dashboard/${learner.id}`} style={{ textDecoration: 'none' }}>
          <Button variant="contained" size="small" sx={{ textTransform: 'none' }}>
            View Details
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
