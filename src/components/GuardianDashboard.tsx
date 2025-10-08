'use client';

import React from 'react';
import { Box, Card, CardContent, Typography, Grid } from '@mui/material';
import LearnerCard from './LessonCard';

// Mock learner list (replace with API call later)
const learners = [
  { id: 'amina', name: 'Amina', progress: 82, lessonsCompleted: 12 },
  { id: 'john', name: 'John', progress: 67, lessonsCompleted: 9 },
  { id: 'mary', name: 'Mary', progress: 91, lessonsCompleted: 15 },
  { id: 'sam', name: 'Sam', progress: 87, lessonsCompleted: 12 }
];

export default function GuardianDashboard() {
  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 900,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.25)',
        backdropFilter: 'blur(10px)',
        p: 4,
      }}
    >
      <CardContent>
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          gutterBottom
          sx={{ color: '#1a1a1a', mb: 4 }}
        >
          Guardian Dashboard
        </Typography>

        <Grid container spacing={3}>
          {learners.map((learner) => (
            <Grid item xs={12} sm={6} md={4} key={learner.id}>
              <LearnerCard learner={learner}/>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
}
