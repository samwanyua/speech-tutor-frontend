'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import ProgressChart from '@/components/ProgressChart';
import Link from 'next/link';

export default function LearnerDetailPage() {
  const { learnerId } = useParams();

  // Mock learner data (later fetched from backend)
  const learner = {
    id: learnerId,
    name: learnerId?.toString().charAt(0).toUpperCase() + learnerId?.toString().slice(1),
    accuracy: 82,
    fluency: 76,
    recentFeedback: 'Great progress! Focus on clearer vowel pronunciation.',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '85vh',
        backgroundColor: 'transparent',
        p: 3,
      }}
    >
      <Card
        elevation={4}
        sx={{
          width: '100%',
          maxWidth: 700,
          borderRadius: 4,
          backgroundColor: 'rgba(255,255,255,0.25)',
          backdropFilter: 'blur(8px)',
          p: 4,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            textAlign="center"
            fontWeight={700}
            gutterBottom
          >
            {learner.name}’s Progress
          </Typography>

          <ProgressChart accuracy={learner.accuracy} fluency={learner.fluency} />

          <Typography
            variant="body1"
            textAlign="center"
            sx={{ mt: 3, fontStyle: 'italic', color: '#2e7d32' }}
          >
            “{learner.recentFeedback}”
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Link href="/dashboard" style={{ textDecoration: 'none' }}>
              <Button variant="outlined" sx={{ textTransform: 'none' }}>
                Back to Dashboard
              </Button>
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
