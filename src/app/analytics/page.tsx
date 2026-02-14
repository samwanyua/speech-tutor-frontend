'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from '@mui/material';
import {
  getDashboardAnalytics,
  getProgressTrend,
  getAchievements,
} from '@/utils/api';
import {
  StatCard,
  PerformanceBreakdown,
  ProgressChart,
  AchievementStats,
  AchievementsList,
} from '@/components/analytics';
import SchoolIcon from '@mui/icons-material/School';
import TimerIcon from '@mui/icons-material/Timer';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

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

interface AchievementsData {
  current_streak_days: number;
  achievements: Achievement[];
  total_lessons_completed: number;
  best_daily_score: number;
}

export default function AnalyticsPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<AchievementsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [days] = useState(7);

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
            <Grid item xs={12} sm={6} md={3} {...({} as any)}>
              <StatCard
                icon={<SchoolIcon />}
                value={dashboardData.summary.total_lessons_completed}
                label="Lessons Completed"
                iconColor="primary.main"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3} {...({} as any)}>
              <StatCard
                icon={<TimerIcon />}
                value={dashboardData.summary.total_practice_time_minutes}
                label="Minutes Practiced"
                iconColor="warning.main"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3} {...({} as any)}>
              <StatCard
                icon={<TrendingUpIcon />}
                value={`${dashboardData.summary.success_rate.toFixed(0)}%`}
                label="Success Rate"
                iconColor="success.main"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3} {...({} as any)}>
              <StatCard
                icon={<EmojiEventsIcon />}
                value={dashboardData.summary.average_pronunciation_score.toFixed(0)}
                label="Avg Score"
                iconColor="error.main"
              />
            </Grid>
          </Grid>

          {/* Performance Breakdown */}
          <PerformanceBreakdown
            averagePronunciationScore={dashboardData.summary.average_pronunciation_score}
            successRate={dashboardData.summary.success_rate}
            totalAttempts={dashboardData.summary.total_attempts}
            successfulAttempts={dashboardData.summary.successful_attempts}
          />
        </>
      )}

      {/* Progress Trend Tab */}
      {tabValue === 1 && <ProgressChart data={trendData} />}

      {/* Achievements Tab */}
      {tabValue === 2 && achievements && (
        <>
          <AchievementStats
            currentStreakDays={achievements.current_streak_days}
            achievementsCount={achievements.achievements.length}
            totalLessonsCompleted={achievements.total_lessons_completed}
            bestDailyScore={achievements.best_daily_score}
          />

          <AchievementsList achievements={achievements.achievements} />
        </>
      )}
    </Container>
  );
}