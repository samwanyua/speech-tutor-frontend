'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Tabs,
  Tab,
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
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
  BarChart,
  Bar,
} from 'recharts';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimerIcon from '@mui/icons-material/Timer';
import MicIcon from '@mui/icons-material/Mic';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useAuth } from '@/context/AuthContext';

// API functions for learner-specific data
async function getLearnerProfile(learnerId: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/learners/${learnerId}/profile`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error('Failed to fetch learner profile');
  return res.json();
}

async function getLearnerAnalytics(learnerId: string, days: number = 30) {
  const token = localStorage.getItem('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/learners/${learnerId}/analytics?days=${days}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

async function getLearnerProgress(learnerId: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/learners/${learnerId}/progress`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error('Failed to fetch progress');
  return res.json();
}

async function getLearnerVoiceSamples(learnerId: string) {
  const token = localStorage.getItem('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/learners/${learnerId}/voice-samples`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error('Failed to fetch voice samples');
  return res.json();
}

async function getLearnerPracticeSessions(learnerId: string, limit: number = 10) {
  const token = localStorage.getItem('token');
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/learners/${learnerId}/sessions?limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error('Failed to fetch sessions');
  return res.json();
}

interface LearnerProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  date_of_birth?: string;
  impairment_type?: string;
  severity_level?: string;
  language_preference: string;
  created_at: string;
}

interface AnalyticsData {
  summary: {
    total_practice_time_minutes: number;
    total_lessons_completed: number;
    total_attempts: number;
    successful_attempts: number;
    success_rate: number;
    average_pronunciation_score: number;
    current_streak: number;
  };
  daily_analytics: any[];
  trend_data: any[];
}

export default function LearnerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const learnerId = params.learnerId as string;

  const [learnerProfile, setLearnerProfile] = useState<LearnerProfile | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [voiceSamples, setVoiceSamples] = useState<any[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [selectedAudio, setSelectedAudio] = useState<string | null>(null);

  useEffect(() => {
    // Check if user has permission to view this learner
    if (user && (user.role === 'teacher' || user.role === 'guardian')) {
      loadAllData();
    } else {
      setError('You do not have permission to view this page');
      setLoading(false);
    }
  }, [learnerId, user]);

  const loadAllData = async () => {
    try {
      setLoading(true);
      
      // Load all data in parallel
      const [profileData, analyticsData, progressData, voiceData, sessionsData] =
        await Promise.all([
          getLearnerProfile(learnerId),
          getLearnerAnalytics(learnerId, 30),
          getLearnerProgress(learnerId),
          getLearnerVoiceSamples(learnerId),
          getLearnerPracticeSessions(learnerId, 10),
        ]);

      setLearnerProfile(profileData);
      setAnalytics(analyticsData);
      setProgress(progressData);
      setVoiceSamples(voiceData);
      setSessions(sessionsData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
    setSelectedAudio(audioUrl);
    audio.onended = () => setSelectedAudio(null);
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !learnerProfile) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Learner not found'}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/dashboard')}
          sx={{ mt: 2 }}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* Learner Profile Card */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={3}>
            {/* Profile Info */}
            <Grid item xs={12} md={4}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: 'primary.main',
                    mx: 'auto',
                    mb: 2,
                    fontSize: '3rem',
                  }}
                >
                  {learnerProfile.full_name?.charAt(0).toUpperCase()}
                </Avatar>

                <Typography variant="h5" fontWeight={700} gutterBottom>
                  {learnerProfile.full_name}
                </Typography>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {learnerProfile.email}
                </Typography>

                <Chip
                  label="Learner"
                  color="primary"
                  size="small"
                  sx={{ mt: 1 }}
                />

                <Divider sx={{ my: 2 }} />

                <Box sx={{ textAlign: 'left' }}>
                  {learnerProfile.date_of_birth && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Age:</strong> {calculateAge(learnerProfile.date_of_birth)}{' '}
                      years
                    </Typography>
                  )}

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Language:</strong>{' '}
                    {learnerProfile.language_preference === 'en-KE'
                      ? 'English'
                      : 'Swahili'}
                  </Typography>

                  {learnerProfile.impairment_type && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Impairment:</strong> {learnerProfile.impairment_type}
                    </Typography>
                  )}

                  {learnerProfile.severity_level && (
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Severity:</strong> {learnerProfile.severity_level}
                    </Typography>
                  )}

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                    Member since:{' '}
                    {new Date(learnerProfile.created_at).toLocaleDateString()}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Quick Stats */}
            <Grid item xs={12} md={8}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Performance Overview
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6} sm={3}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.02)', textAlign: 'center' }}>
                    <SchoolIcon sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h4" fontWeight={700}>
                      {analytics?.summary.total_lessons_completed || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Lessons
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.02)', textAlign: 'center' }}>
                    <TrendingUpIcon sx={{ fontSize: 32, color: 'success.main', mb: 1 }} />
                    <Typography variant="h4" fontWeight={700}>
                      {analytics?.summary.success_rate.toFixed(0) || 0}%
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Success
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.02)', textAlign: 'center' }}>
                    <TimerIcon sx={{ fontSize: 32, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h4" fontWeight={700}>
                      {analytics?.summary.total_practice_time_minutes || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Minutes
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Paper elevation={0} sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.02)', textAlign: 'center' }}>
                    <PersonIcon sx={{ fontSize: 32, color: 'error.main', mb: 1 }} />
                    <Typography variant="h4" fontWeight={700}>
                      {analytics?.summary.average_pronunciation_score.toFixed(0) || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Avg Score
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {/* Performance Bars */}
              <Box sx={{ mt: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">Pronunciation Accuracy</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {analytics?.summary.average_pronunciation_score.toFixed(1) || 0}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={analytics?.summary.average_pronunciation_score || 0}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">Success Rate</Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {analytics?.summary.success_rate.toFixed(1) || 0}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={analytics?.summary.success_rate || 0}
                    color="success"
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                {analytics?.summary.current_streak > 0 && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    🔥 Current streak: {analytics.summary.current_streak} days!
                  </Alert>
                )}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Progress Trend" />
        <Tab label="Lesson Progress" />
        <Tab label="Practice Sessions" />
        <Tab label="Voice Samples" />
      </Tabs>

      {/* Tab 0: Progress Trend */}
      {tabValue === 0 && analytics && (
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              30-Day Performance Trend
            </Typography>

            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={analytics.trend_data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
                  strokeWidth={2}
                  name="Pronunciation Score"
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="success_rate"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  name="Success Rate (%)"
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Daily Stats Table */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Recent Daily Stats
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell align="right">Practice Time</TableCell>
                      <TableCell align="right">Attempts</TableCell>
                      <TableCell align="right">Success Rate</TableCell>
                      <TableCell align="right">Avg Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {analytics.daily_analytics.slice(0, 7).map((day: any) => (
                      <TableRow key={day.date}>
                        <TableCell>{new Date(day.date).toLocaleDateString()}</TableCell>
                        <TableCell align="right">{day.practice_time_minutes} min</TableCell>
                        <TableCell align="right">{day.total_attempts}</TableCell>
                        <TableCell align="right">
                          <Chip
                            label={`${((day.successful_attempts / day.total_attempts) * 100).toFixed(0)}%`}
                            size="small"
                            color={
                              (day.successful_attempts / day.total_attempts) * 100 >= 70
                                ? 'success'
                                : 'warning'
                            }
                          />
                        </TableCell>
                        <TableCell align="right">
                          {day.average_pronunciation_score?.toFixed(1) || '-'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Tab 1: Lesson Progress */}
      {tabValue === 1 && (
        <Grid container spacing={3}>
          {progress.length === 0 ? (
            <Grid item xs={12}>
              <Card elevation={2}>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <Typography variant="h6" color="text.secondary">
                    No lessons started yet
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ) : (
            progress.map((item: any) => (
              <Grid item xs={12} md={6} key={item.id}>
                <Card elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {item.lesson?.title || 'Lesson'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.lesson?.category} • {item.lesson?.language === 'en-KE' ? 'English' : 'Swahili'}
                        </Typography>
                      </Box>
                      <Chip
                        label={item.status.replace('_', ' ')}
                        color={
                          item.status === 'completed'
                            ? 'success'
                            : item.status === 'in_progress'
                            ? 'warning'
                            : 'default'
                        }
                        size="small"
                      />
                    </Box>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption">Progress</Typography>
                        <Typography variant="caption" fontWeight={600}>
                          {item.completion_percentage.toFixed(0)}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={item.completion_percentage}
                        sx={{ height: 6, borderRadius: 3 }}
                      />
                    </Box>

                    {item.started_at && (
                      <Typography variant="caption" color="text.secondary">
                        Started: {new Date(item.started_at).toLocaleDateString()}
                      </Typography>
                    )}

                    {item.completed_at && (
                      <Typography variant="caption" color="success.main" sx={{ display: 'block', mt: 0.5 }}>
                        Completed: {new Date(item.completed_at).toLocaleDateString()}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {/* Tab 2: Practice Sessions */}
      {tabValue === 2 && (
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Recent Practice Sessions
            </Typography>

            {sessions.length === 0 ? (
              <Typography color="text.secondary" textAlign="center" py={4}>
                No practice sessions yet
              </Typography>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Lesson</TableCell>
                      <TableCell align="right">Duration</TableCell>
                      <TableCell align="right">Attempts</TableCell>
                      <TableCell align="right">Successful</TableCell>
                      <TableCell align="right">Success Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sessions.map((session: any) => {
                      const successRate = session.total_attempts > 0
                        ? (session.successful_attempts / session.total_attempts) * 100
                        : 0;

                      return (
                        <TableRow key={session.id}>
                          <TableCell>
                            {new Date(session.started_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{session.lesson?.title || '-'}</TableCell>
                          <TableCell align="right">
                            {session.ended_at
                              ? `${Math.round(
                                  (new Date(session.ended_at).getTime() -
                                    new Date(session.started_at).getTime()) /
                                    60000
                                )} min`
                              : 'In progress'}
                          </TableCell>
                          <TableCell align="right">{session.total_attempts}</TableCell>
                          <TableCell align="right">{session.successful_attempts}</TableCell>
                          <TableCell align="right">
                            <Chip
                              label={`${successRate.toFixed(0)}%`}
                              size="small"
                              color={successRate >= 70 ? 'success' : 'warning'}
                            />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Voice Samples */}
      {tabValue === 3 && (
        <Card elevation={2}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Voice Samples ({voiceSamples.length})
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Review recorded voice samples for personalization
            </Typography>

            {voiceSamples.length === 0 ? (
              <Typography color="text.secondary" textAlign="center" py={4}>
                No voice samples recorded yet
              </Typography>
            ) : (
              <List>
                {voiceSamples.map((sample: any) => (
                  <ListItem
                    key={sample.id}
                    sx={{
                      border: '1px solid #ddd',
                      borderRadius: 2,
                      mb: 2,
                      bgcolor: 'rgba(0,0,0,0.01)',
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => playAudio(sample.audio_url)}
                        disabled={selectedAudio === sample.audio_url}
                      >
                        <PlayArrowIcon />
                      </IconButton>
                    }
                  >
                    <ListItemIcon>
                      <MicIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText
                      primary={sample.transcription || 'Processing...'}
                      secondary={
                        <Box component="span">
                          <Typography variant="caption" component="span">
                            Quality: {(sample.quality_score * 100).toFixed(0)}% •{' '}
                            Duration: {sample.duration_seconds.toFixed(1)}s •{' '}
                            {new Date(sample.recorded_at).toLocaleDateString()}
                          </Typography>
                          <br />
                          {sample.used_for_training && (
                            <Chip
                              label="Used for Training"
                              size="small"
                              color="success"
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      )}
    </Container>
  );
}