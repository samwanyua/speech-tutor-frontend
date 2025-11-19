'use client';

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  LinearProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useLesson } from '@/context/LessonContext';

export default function FeedbackPage() {
  const router = useRouter();
  const { currentLesson, feedback, lessonLevel, resetLesson } = useLesson();

  // Handle cases where feedback is not yet available
  if (!feedback || !currentLesson) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
          p: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ color: '#444' }}>
          ⚠️ No feedback data available. Please complete a lesson first.
        </Typography>
      </Box>
    );
  }

  const handleRetry = () => {
    resetLesson();
    router.push(`/lessons/${lessonLevel}`);
  };

  const handleNextLesson = () => {
    resetLesson();

    const nextLevel =
      lessonLevel === 'easy'
        ? 'medium'
        : lessonLevel === 'medium'
        ? 'hard'
        : 'easy'; // loop back to easy

    router.push(`/lessons/${nextLevel}`);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '85vh',
        backgroundColor: 'transparent',
        p: 3,
      }}
    >
      <Card
        elevation={4}
        sx={{
          width: '100%',
          maxWidth: 600,
          borderRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          backdropFilter: 'blur(8px)',
          p: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            gutterBottom
            sx={{ color: '#1a1a1a' }}
          >
            Lesson Feedback
          </Typography>

          <Typography
            variant="subtitle1"
            textAlign="center"
            sx={{ mb: 3, color: '#444' }}
          >
            Lesson: {currentLesson.phrase}
          </Typography>

          {/* Accuracy */}
          <Typography sx={{ mb: 1, fontWeight: 600 }}>Accuracy</Typography>
          <LinearProgress
            variant="determinate"
            value={feedback.accuracy}
            sx={{
              height: 10,
              borderRadius: 5,
              mb: 2,
              backgroundColor: 'rgba(0,0,0,0.1)',
            }}
          />
          <Typography variant="body2" sx={{ mb: 2 }}>
            {feedback.accuracy}% accurate pronunciation
          </Typography>

          {/* Fluency */}
          <Typography sx={{ mb: 1, fontWeight: 600 }}>Fluency</Typography>
          <LinearProgress
            variant="determinate"
            value={feedback.fluency}
            sx={{
              height: 10,
              borderRadius: 5,
              mb: 2,
              backgroundColor: 'rgba(0,0,0,0.1)',
            }}
          />
          <Typography variant="body2" sx={{ mb: 3 }}>
            {feedback.fluency}% fluent speech
          </Typography>

          {/* Qualitative Feedback */}
          <Typography
            variant="body1"
            textAlign="center"
            sx={{
              fontStyle: 'italic',
              color: '#2e7d32',
              mb: 4,
            }}
          >
            “{feedback.comments || 'Great effort! Keep practicing.'}”
          </Typography>

          {/* Buttons */}
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="outlined"
              color="primary"
              onClick={handleRetry}
              sx={{ textTransform: 'none' }}
            >
              Try Again
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleNextLesson}
              sx={{ textTransform: 'none' }}
            >
              Next Lesson
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
