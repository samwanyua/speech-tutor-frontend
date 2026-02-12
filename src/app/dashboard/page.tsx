'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
} from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { getDashboardAnalytics } from '@/utils/api';
import Link from 'next/link';
import PersonIcon from '@mui/icons-material/Person';
import BarChartIcon from '@mui/icons-material/BarChart';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadDashboard();
    }
  }, [user]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const data = await getDashboardAnalytics(7);
      setDashboardData(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="warning">Please log in to view your dashboard</Alert>
      </Container>
    );
  }

  // Learner Dashboard
  if (user.role === 'learner') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Welcome back, {user.full_name}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Here's your learning overview
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {dashboardData && (
          <>
            {/* Quick Stats */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight={700} color="primary.main">
                      {dashboardData.summary.total_lessons_completed}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lessons Completed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight={700} color="success.main">
                      {dashboardData.summary.success_rate.toFixed(0)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Success Rate
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight={700} color="warning.main">
                      {dashboardData.summary.total_practice_time_minutes}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Minutes Practiced
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" fontWeight={700} color="error.main">
                      {dashboardData.summary.average_pronunciation_score.toFixed(
                        0
                      )}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Avg Pronunciation
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Quick Actions */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Continue Learning
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Pick up where you left off
                    </Typography>
                    <Button
                      variant="contained"
                      component={Link}
                      href="/lessons"
                      fullWidth
                    >
                      Browse Lessons
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card elevation={2}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      View Analytics
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Track your progress in detail
                    </Typography>
                    <Button
                      variant="outlined"
                      component={Link}
                      href="/analytics"
                      fullWidth
                      startIcon={<BarChartIcon />}
                    >
                      See Analytics
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Recent Sessions */}
            {dashboardData.recent_sessions &&
              dashboardData.recent_sessions.length > 0 && (
                <Card elevation={2} sx={{ mt: 3 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Recent Practice Sessions
                    </Typography>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Attempts</TableCell>
                            <TableCell>Successful</TableCell>
                            <TableCell>Duration</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dashboardData.recent_sessions.map((session: any) => (
                            <TableRow key={session.id}>
                              <TableCell>
                                {new Date(
                                  session.started_at
                                ).toLocaleDateString()}
                              </TableCell>
                              <TableCell>{session.total_attempts}</TableCell>
                              <TableCell>{session.successful_attempts}</TableCell>
                              <TableCell>
                                {session.ended_at
                                  ? Math.round(
                                      (new Date(session.ended_at).getTime() -
                                        new Date(session.started_at).getTime()) /
                                        60000
                                    )
                                  : '-'}{' '}
                                min
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              )}
          </>
        )}
      </Container>
    );
  }

  // Teacher/Guardian Dashboard
  // This would show list of assigned learners
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {user.role === 'teacher' ? 'Teacher' : 'Guardian'} Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Monitor your learners' progress
      </Typography>

      <Card elevation={2}>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <PersonIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Learner Management Coming Soon
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You'll be able to view and monitor your assigned learners here
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}