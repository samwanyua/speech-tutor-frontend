import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Grid,
} from '@mui/material';

interface PerformanceBreakdownProps {
  averagePronunciationScore: number;
  successRate: number;
  totalAttempts: number;
  successfulAttempts: number;
}

export default function PerformanceBreakdown({
  averagePronunciationScore,
  successRate,
  totalAttempts,
  successfulAttempts,
}: PerformanceBreakdownProps) {
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Performance Breakdown
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Typography variant="body2">Pronunciation Accuracy</Typography>
            <Typography variant="body2" fontWeight={600}>
              {averagePronunciationScore.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={averagePronunciationScore}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Typography variant="body2">Success Rate</Typography>
            <Typography variant="body2" fontWeight={600}>
              {successRate.toFixed(1)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={successRate}
            color="success"
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6} {...({} as any)}>
            <Typography variant="body2" color="text.secondary">
              Total Attempts
            </Typography>
            <Typography variant="h5" fontWeight={600}>
              {totalAttempts}
            </Typography>
          </Grid>
          <Grid item xs={6} {...({} as any)}>
            <Typography variant="body2" color="text.secondary">
              Successful Attempts
            </Typography>
            <Typography variant="h5" fontWeight={600} color="success.main">
              {successfulAttempts}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}