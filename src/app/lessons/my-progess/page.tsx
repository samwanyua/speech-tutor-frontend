'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import Link from 'next/link';
import { getMyProgress } from '@/utils/api';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import LockIcon from '@mui/icons-material/Lock';

interface LessonProgress {
  id: string;
  lesson_id: string;
  status: 'not_started' | 'in_progress' | 'completed';
  completion_percentage: number;
  started_at?: string;
  completed_at?: string;
  lesson?: {
    title: string;
    description: string;
    category: string;
    difficulty_level: number;
  };
}

export default function MyProgressPage() {
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const data = await getMyProgress();
      setProgress(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon />;
      case 'in_progress':
        return <PlayCircleOutlineIcon />;
      default:
        return <LockIcon />;
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  const completedCount = progress.filter((p) => p.status === 'completed').length;
  const inProgressCount = progress.filter((p) => p.status === 'in_progress').length;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        My Learning Progress
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Track your journey through all lessons
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={700} color="success.main">
                {completedCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={700} color="warning.main">
                {inProgressCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                In Progress
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h3" fontWeight={700} color="primary.main">
                {progress.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Lessons
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Progress List */}
      {progress.length === 0 ? (
        <Card elevation={2}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No lessons started yet
            </Typography>
            <Button
              variant="contained"
              component={Link}
              href="/lessons"
              sx={{ mt: 2 }}
            >
              Browse Lessons
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {progress.map((item) => (
            <Grid item xs={12} md={6} key={item.id}>
              <Card
                elevation={2}
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      {item.lesson?.title || 'Lesson'}
                    </Typography>
                    <Chip
                      icon={getStatusIcon(item.status)}
                      label={item.status.replace('_', ' ')}
                      color={getStatusColor(item.status) as any}
                      size="small"
                    />
                  </Box>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {item.lesson?.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        mb: 0.5,
                      }}
                    >
                      <Typography variant="caption">Progress</Typography>
                      <Typography variant="caption" fontWeight={600}>
                        {item.completion_percentage.toFixed(0)}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={item.completion_percentage}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>

                  {item.started_at && (
                    <Typography variant="caption" color="text.secondary">
                      Started:{' '}
                      {new Date(item.started_at).toLocaleDateString()}
                    </Typography>
                  )}

                  {item.completed_at && (
                    <Typography
                      variant="caption"
                      color="success.main"
                      sx={{ display: 'block', mt: 0.5 }}
                    >
                      Completed:{' '}
                      {new Date(item.completed_at).toLocaleDateString()}
                    </Typography>
                  )}

                  <Box sx={{ mt: 2 }}>
                    <Button
                      component={Link}
                      href={`/lessons/${item.lesson_id}`}
                      variant={
                        item.status === 'completed' ? 'outlined' : 'contained'
                      }
                      fullWidth
                    >
                      {item.status === 'completed' ? 'Review' : 'Continue'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}