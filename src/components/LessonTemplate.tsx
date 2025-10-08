// src/components/LessonTemplate.tsx
'use client';

import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Stack } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import MicIcon from '@mui/icons-material/Mic';
import ReplayIcon from '@mui/icons-material/Replay';

interface LessonTemplateProps {
  level: 'Easy' | 'Medium' | 'Hard';
  phrase: string;
}

export default function LessonTemplate({ level, phrase }: LessonTemplateProps) {
  const [recording, setRecording] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handlePlay = () => {
    console.log(`TTS play: ${phrase}`);
    // Later: trigger backend TTS here
  };

  const handleRecord = () => {
    setRecording(true);
    console.log('Recording started...');
    // Later: handle mic recording and STT
    setTimeout(() => {
      setRecording(false);
      setFeedback('Good pronunciation! Keep it up.');
    }, 2500);
  };

  const handleRepeat = () => {
    setFeedback('');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: 'rgba(255, 255, 255, 0.3)', // transparent white card
        backdropFilter: 'blur(8px)',
        
        p: 2,
      }}
    >
      <Card
        elevation={4}
        sx={{
          width: 600,
          borderRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(8px)',
          textAlign: 'center',
          p: 3,
        }}
      >
        <CardContent>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {level} Lesson
          </Typography>

          <Typography variant="h6" sx={{ mb: 3, color: '#444' }}>
            {phrase}
          </Typography>

          <Stack direction="row" spacing={3} justifyContent="center" sx={{ mb: 3 }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<VolumeUpIcon />}
              onClick={handlePlay}
            >
              Play
            </Button>

            <Button
              variant="contained"
              color={recording ? 'secondary' : 'success'}
              startIcon={<MicIcon />}
              onClick={handleRecord}
              disabled={recording}
            >
              {recording ? 'Recording...' : 'Record'}
            </Button>

            <Button
              variant="outlined"
              color="primary"
              startIcon={<ReplayIcon />}
              onClick={handleRepeat}
            >
              Try Again
            </Button>
          </Stack>

          {feedback && (
            <Typography variant="body1" sx={{ color: '#00695c', mt: 2 }}>
              {feedback}
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
