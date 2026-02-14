import React from 'react';
import { Grid } from '@mui/material';
import StatCard from './StatCard';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

interface AchievementStatsProps {
  currentStreakDays: number;
  achievementsCount: number;
  totalLessonsCompleted: number;
  bestDailyScore: number;
}

export default function AchievementStats({
  currentStreakDays,
  achievementsCount,
  totalLessonsCompleted,
  bestDailyScore,
}: AchievementStatsProps) {
  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3} {...({} as any)}>
        <StatCard
          icon={<LocalFireDepartmentIcon />}
          value={currentStreakDays}
          label="Day Streak"
          iconColor="error.main"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3} {...({} as any)}>
        <StatCard
          icon={<EmojiEventsIcon />}
          value={achievementsCount}
          label="Achievements"
          iconColor="warning.main"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3} {...({} as any)}>
        <StatCard
          icon={<SchoolIcon />}
          value={totalLessonsCompleted}
          label="Total Lessons"
          iconColor="primary.main"
        />
      </Grid>

      <Grid item xs={12} sm={6} md={3} {...({} as any)}>
        <StatCard
          icon={<TrendingUpIcon />}
          value={bestDailyScore.toFixed(0)}
          label="Best Score"
          iconColor="success.main"
        />
      </Grid>
    </Grid>
  );
}