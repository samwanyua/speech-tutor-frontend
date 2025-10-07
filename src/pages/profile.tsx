// src/app/profile.tsx
'use client';

import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stack,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [language, setLanguage] = useState('english');
  const [recording, setRecording] = useState(false);
  const [sampleSaved, setSampleSaved] = useState(false);

  const handleRecord = () => {
    setRecording(true);
    console.log('Recording baseline sample...');
    // Later: integrate with backend or Web Audio API
    setTimeout(() => {
      setRecording(false);
      setSampleSaved(true);
    }, 3000);
  };

  const handleSave = () => {
    const learnerProfile = { name, age, language, baselineRecorded: sampleSaved };
    console.log('Saving learner profile:', learnerProfile);
    alert('Profile saved successfully!');
    // Later: send POST request to FastAPI backend
  };

  const handleReset = () => {
    setName('');
    setAge('');
    setLanguage('english');
    setSampleSaved(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '85vh',
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(6px)',
        p: 2,
      }}
    >
      <Card
        elevation={3}
        sx={{
          width: 600,
          borderRadius: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(8px)',
          p: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            fontWeight={700}
            gutterBottom
            textAlign="center"
            sx={{ color: '#333', mb: 3 }}
          >
            Learner Profile Setup
          </Typography>

          <Stack spacing={3}>
            {/* Name Input */}
            <TextField
              label="Learner Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
            />

            {/* Age Input */}
            <TextField
              label="Age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              fullWidth
              required
            />

            {/* Language Selection */}
            <TextField
              select
              label="Preferred Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              fullWidth
            >
              <MenuItem value="english">English</MenuItem>
              <MenuItem value="swahili">Swahili</MenuItem>
            </TextField>

            {/* Record Baseline Speech */}
            <Button
              variant="contained"
              color={recording ? 'secondary' : 'primary'}
              startIcon={<MicIcon />}
              onClick={handleRecord}
              disabled={recording}
              sx={{ textTransform: 'none', py: 1.2 }}
            >
              {recording
                ? 'Recording...'
                : sampleSaved
                ? 'Recorded ✓'
                : 'Record Baseline Sample'}
            </Button>

            {/* Save & Reset */}
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                color="success"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                disabled={!name || !age}
                sx={{ textTransform: 'none' }}
              >
                Save Profile
              </Button>

              <Button
                variant="outlined"
                color="error"
                startIcon={<RestartAltIcon />}
                onClick={handleReset}
                sx={{ textTransform: 'none' }}
              >
                Reset
              </Button>
            </Stack>
          </Stack>

          {/* Confirmation */}
          {sampleSaved && (
            <Typography
              variant="body2"
              sx={{
                mt: 3,
                color: '#2e7d32',
                textAlign: 'center',
                fontWeight: 500,
              }}
            >
              🎤 Baseline speech sample saved successfully!
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
