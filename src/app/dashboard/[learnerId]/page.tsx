'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import ProgressChart from '@/components/ProgressChart';
import Link from 'next/link';
import api from '@/utils/api'; 

export default function LearnerDetailPage() {
  const { learnerId } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!learnerId) return;

    api.get(`/dashboard/${learnerId}`)
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [learnerId]);

  if (!data) return <p>Loading...</p>;

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '85vh', p: 3 }}>
      <Card elevation={4} sx={{ width: '100%', maxWidth: 700, borderRadius: 4, p: 4 }}>
        <CardContent>
          <Typography variant="h4" textAlign="center" fontWeight={700} gutterBottom>
            {data.name}’s Progress
          </Typography>

          <ProgressChart accuracy={data.accuracy ?? 0} fluency={data.fluency ?? 0} />

          <Typography variant="body1" textAlign="center" sx={{ mt: 3, fontStyle: 'italic', color: '#2e7d32' }}>
            “{data.recent_feedback ?? 'No feedback yet'}”
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Link href="/dashboard">
              <Button variant="outlined">Back to Dashboard</Button>
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
