'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress
} from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { getDashboardAnalytics, getAchievements } from '@/utils/api';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';

import type { User } from '@/utils/api';

export default function ProfilePage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const user = authUser as User | null;

  const [analytics, setAnalytics] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProfileData();
    }
  }, [user]);

  const loadProfileData = async () => {
    try {
      setLoadingStats(true);
      const [analyticsData, achievementsData] = await Promise.all([
        getDashboardAnalytics(30).catch(() => null),
        getAchievements().catch(() => [])
      ]);
      setAnalytics(analyticsData);
      setAchievements(achievementsData?.achievements || []);
    } catch (err: any) {
      setError('Could not load profile statistics.');
    } finally {
      setLoadingStats(false);
    }
  };

  if (authLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container sx={{ mt: 8 }}>
        <Alert severity="warning">Please log in to view your profile</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Left Column: Profile Info */}
        <Grid item xs={12} md={4} {...({} as any)}>
          <Card elevation={3} sx={{ borderRadius: 4, backdropFilter: 'blur(8px)', backgroundColor: 'rgba(255, 255, 255, 0.85)' }}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  mx: 'auto',
                  mb: 2,
                  fontSize: '3rem',
                  fontWeight: 700
                }}
              >
                {user.full_name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>

              <Typography variant="h5" fontWeight={700} gutterBottom>
                {user.full_name || 'My Profile'}
              </Typography>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                {user.email}
              </Typography>

              <Typography
                variant="caption"
                sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  display: 'inline-block',
                  mt: 1,
                  fontWeight: 600,
                  letterSpacing: 0.5
                }}
              >
                {user.role?.toUpperCase() || 'LEARNER'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Right Column: Statistics and Badges */}
        <Grid item xs={12} md={8} {...({} as any)}>
          <Card elevation={3} sx={{ borderRadius: 4, mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.85)' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon color="primary" /> My Learning Stats
              </Typography>

              {loadingStats ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : analytics ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4} {...({} as any)}>
                    <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(25, 118, 210, 0.05)', borderRadius: 2 }}>
                      <AssignmentIcon color="primary" fontSize="large" sx={{ mb: 1 }} />
                      <Typography variant="h4" fontWeight={700} color="primary">
                        {analytics.summary?.total_attempts || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Total Attempts</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={4} {...({} as any)}>
                    <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(46, 125, 50, 0.05)', borderRadius: 2 }}>
                      <CheckCircleOutlineIcon color="success" fontSize="large" sx={{ mb: 1 }} />
                      <Typography variant="h4" fontWeight={700} color="success.main">
                        {analytics.summary?.successful_attempts || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Successful Phrases</Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={4} {...({} as any)}>
                    <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'rgba(237, 108, 2, 0.05)', borderRadius: 2 }}>
                      <TrendingUpIcon color="warning" fontSize="large" sx={{ mb: 1 }} />
                      <Typography variant="h4" fontWeight={700} color="warning.main">
                        {analytics.summary?.average_score ? Math.round(analytics.summary.average_score) : 0}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Avg. Pronunciation</Typography>
                    </Box>
                  </Grid>
                </Grid>
              ) : (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  No statistics available yet. Complete a lesson to see your progress!
                </Typography>
              )}
            </CardContent>
          </Card>

          <Card elevation={3} sx={{ borderRadius: 4, backgroundColor: 'rgba(255, 255, 255, 0.85)' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <WorkspacePremiumIcon color="secondary" /> Recent Achievements
              </Typography>

              {loadingStats ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : achievements.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={4} sx={{ bgcolor: '#f9f9f9', borderRadius: 2 }}>
                  Start practicing to earn your first achievement badge!
                </Typography>
              ) : (
                <List sx={{ width: '100%' }}>
                  {achievements.slice(0, 3).map((badge, idx) => (
                    <React.Fragment key={badge.id || idx}>
                      <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: badge.type === 'streak' ? 'warning.main' : 'primary.main' }}>
                            <WorkspacePremiumIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography fontWeight={600}>{badge.title || badge.badge_name}</Typography>}
                          secondary={badge.description}
                        />
                      </ListItem>
                      {idx < achievements.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}