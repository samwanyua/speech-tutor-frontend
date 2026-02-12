'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Grid,
  Chip,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getLessons } from '@/utils/api';
import SchoolIcon from '@mui/icons-material/School';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CleanHandsIcon from '@mui/icons-material/CleanHands';

interface Lesson {
  id: string;
  title: string;
  description: string;
  category: 'nutrition' | 'hygiene';
  language: string;
  difficulty_level: number;
}

export default function LessonsPage() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [category, setCategory] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [language, setLanguage] = useState<string>('');

  useEffect(() => {
    loadLessons();
  }, [category, difficulty, language]);

  const loadLessons = async () => {
    try {
      setLoading(true);
      const data = await getLessons({
        category: category || undefined,
        difficulty_level: difficulty ? parseInt(difficulty) : undefined,
        language: language || undefined,
      });
      setLessons(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyLabel = (level: number) => {
    if (level <= 2) return 'Easy';
    if (level <= 3) return 'Medium';
    return 'Hard';
  };

  const getDifficultyColor = (level: number) => {
    if (level <= 2) return 'success';
    if (level <= 3) return 'warning';
    return 'error';
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Explore Lessons
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Practice speaking with nutrition and hygiene lessons
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card elevation={2} sx={{ mb: 4, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="nutrition">Nutrition</MenuItem>
                <MenuItem value="hygiene">Hygiene</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Difficulty</InputLabel>
              <Select
                value={difficulty}
                label="Difficulty"
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="1">Easy (1-2)</MenuItem>
                <MenuItem value="3">Medium (3)</MenuItem>
                <MenuItem value="4">Hard (4-5)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Language</InputLabel>
              <Select
                value={language}
                label="Language"
                onChange={(e) => setLanguage(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="en-KE">English</MenuItem>
                <MenuItem value="sw">Swahili</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Lessons Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : lessons.length === 0 ? (
        <Typography textAlign="center" color="text.secondary" py={8}>
          No lessons found. Try adjusting your filters.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {lessons.map((lesson) => (
            <Grid item xs={12} sm={6} md={4} key={lesson.id}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2,
                    }}
                  >
                    {lesson.category === 'nutrition' ? (
                      <RestaurantIcon color="primary" />
                    ) : (
                      <CleanHandsIcon color="primary" />
                    )}

                    <Chip
                      label={getDifficultyLabel(lesson.difficulty_level)}
                      color={getDifficultyColor(lesson.difficulty_level) as any}
                      size="small"
                    />
                  </Box>

                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {lesson.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    {lesson.description}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip
                      label={lesson.category}
                      size="small"
                      variant="outlined"
                    />
                    <Chip
                      label={lesson.language === 'en-KE' ? 'English' : 'Swahili'}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Link href={`/lessons/${lesson.id}`} passHref>
                    <Button variant="contained" fullWidth startIcon={<SchoolIcon />}>
                      Start Lesson
                    </Button>
                  </Link>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}