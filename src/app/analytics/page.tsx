'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  CircularProgress,
  Alert,
  Chip,
  LinearProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  getDashboardAnalytics,
  getProgressTrend,
  getAchievements,
} from '@/utils/api';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SchoolIcon from '@mui/icons-material/School';
import TimerIcon from '@mui/icons-material/Timer';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

interface DashboardData {
  summary: {
    total_practice_time_minutes: number;
    total_lessons_completed: number;
    total_attempts: number;
    successful_attempts: number;
    success_rate: number;
    average_pronunciation_score: number;
  };
  daily_analytics: any[];
}

interface Achievement {
  name: string;
  description: string;
  unlocked: boolean;
}

export default function AnalyticsPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [days, setDays] = useState(7);

  useEffect(() => {
    loadAllData();
  }, [days]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [dashboard, trend, achievementsData] = await Promise.all([
        getDashboardAnalytics(days),
        getProgressTrend(30),
        getAchievements(),
      ]);

      setDashboardData(dashboard);
      setTrendData(trend.data);
      setAchievements(achievementsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !dashboardData) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Failed to load analytics'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        My Analytics
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Track your progress and celebrate your achievements
      </Typography>

      <Tabs
        value={tabValue}
        onChange={(_, newValue) => setTabValue(newValue)}
        sx={{ mb: 3 }}
      >
        <Tab label="Overview" />
        <Tab label="Progress Trend" />
        <Tab label="Achievements" />
      </Tabs>

      {/* Overview Tab */}
      {tabValue === 0 && (
        <>
          {/* Summary Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight={700}>
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
                  <TimerIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight={700}>
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
                  <TrendingUpIcon
                    sx={{ fontSize: 40, color: 'success.main', mb: 1 }}
                  />
                  <Typography variant="h4" fontWeight={700}>
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
                  <EmojiEventsIcon
                    sx={{ fontSize: 40, color: 'error.main', mb: 1 }}
                  />
                  <Typography variant="h4" fontWeight={700}>
                    {dashboardData.summary.average_pronunciation_score.toFixed(0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Score
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Performance Breakdown */}
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
                    {dashboardData.summary.average_pronunciation_score.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={dashboardData.summary.average_pronunciation_score}
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
                    {dashboardData.summary.success_rate.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={dashboardData.summary.success_rate}
                  color="success"
                  sx={{ height: 10, borderRadius: 5 }}
                />
              </Box>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Total Attempts
                  </Typography>
                  <Typography variant="h5" fontWeight={600}>
                    {dashboardData.summary.total_attempts}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Successful Attempts
                  </Typography>
                  <Typography variant="h5" fontWeight={600} color="success.main">
                    {dashboardData.summary.successful_attempts}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </>
      )}

      {/* Progress Trend Tab */}
      {tabValue === 1 && (
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              30-Day Progress Trend
            </Typography>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="pronunciation_score"
                  stroke="#8884d8"
                  name="Pronunciation Score"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="success_rate"
                  stroke="#82ca9d"
                  name="Success Rate"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Achievements Tab */}
      {tabValue === 2 && achievements && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <LocalFireDepartmentIcon
                    sx={{ fontSize: 40, color: 'error.main', mb: 1 }}
                  />
                  <Typography variant="h4" fontWeight={700}>
                    {achievements.current_streak_days}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Day Streak
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <EmojiEventsIcon
                    sx={{ fontSize: 40, color: 'warning.main', mb: 1 }}
                  />
                  <Typography variant="h4" fontWeight={700}>
                    {achievements.achievements.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Achievements
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <SchoolIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" fontWeight={700}>
                    {achievements.total_lessons_completed}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Lessons
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrendingUpIcon
                    sx={{ fontSize: 40, color: 'success.main', mb: 1 }}
                  />
                  <Typography variant="h4" fontWeight={700}>
                    {achievements.best_daily_score.toFixed(0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Best Score
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Your Achievements
              </Typography>

              <List>
                {achievements.achievements.map(
                  (achievement: Achievement, index: number) => (
                    <ListItem
                      key={index}
                      sx={{
                        bgcolor: 'rgba(0,0,0,0.02)',
                        borderRadius: 2,
                        mb: 1,
                      }}
                    >
                      <ListItemIcon>
                        <EmojiEventsIcon
                          sx={{ color: 'warning.main', fontSize: 32 }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={achievement.name}
                        secondary={achievement.description}
                        primaryTypographyProps={{ fontWeight: 600 }}
                      />
                      <Chip
                        label="Unlocked"
                        color="success"
                        size="small"
                        icon={<EmojiEventsIcon />}
                      />
                    </ListItem>
                  )
                )}
              </List>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
}