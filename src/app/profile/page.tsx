'use client';

import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  TextField,
  Grid,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '@/context/AuthContext';
import { getVoiceSamples, uploadVoiceSample, deleteVoiceSample } from '@/utils/api';

import type { User } from '@/utils/api';


interface VoiceSample {
  id: string;
  audio_url: string;
  transcription: string;
  quality_score: number;
  duration_seconds: number;
  recorded_at: string;
}



export default function ProfilePage() {
  const { user: authUser, loading: authLoading } = useAuth();
  const user = authUser as User | null;

  const [voiceSamples, setVoiceSamples] = useState<VoiceSample[]>([]);
  const [loading, setLoading] = useState(true);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadVoiceSamples();
    }
  }, [user]);

  const loadVoiceSamples = async () => {
    try {
      setLoading(true);
      const samples = await getVoiceSamples();
      setVoiceSamples(samples);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        await uploadRecording(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err: any) {
      setError('Failed to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const uploadRecording = async (blob: Blob) => {
    try {
      setLoading(true);
      const file = new File([blob], 'recording.wav', { type: 'audio/wav' });
      const result = await uploadVoiceSample(file);
      setSuccess('Voice sample uploaded successfully!');
      await loadVoiceSamples();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSample = async (sampleId: string) => {
    if (!confirm('Delete this voice sample?')) return;

    try {
      await deleteVoiceSample(sampleId);
      setSuccess('Sample deleted');
      await loadVoiceSamples();
    } catch (err: any) {
      setError(err.message);
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
      {success && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
          {success}
        </Alert>
      )}

      <Grid container spacing={4}>
        {/* Profile Info */}
        <Grid item xs={12} md={4} {...({} as any)}>
          <Card elevation={3}>
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: 'primary.main',
                  mx: 'auto',
                  mb: 2,
                  fontSize: '2.5rem',
                }}
              >
                {user.full_name?.charAt(0).toUpperCase()}
              </Avatar>

              <Typography variant="h5" fontWeight={600} gutterBottom>
                {user.full_name}
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
                }}
              >
                {user.role?.toUpperCase()}
              </Typography>

              {user.learner_profile && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body2" gutterBottom>
                      <strong>Impairment:</strong>{' '}
                      {user.learner_profile.impairment_type || 'N/A'}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      <strong>Severity:</strong>{' '}
                      {user.learner_profile.severity_level || 'N/A'}
                    </Typography>
                  </Box>
                </>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Voice Samples */}
        <Grid item xs={12} md={8} {...({} as any)}>
          <Card elevation={3}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <Typography variant="h6" fontWeight={600}>
                  Voice Samples
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<MicIcon />}
                  onClick={recording ? stopRecording : startRecording}
                  color={recording ? 'error' : 'primary'}
                >
                  {recording ? 'Stop Recording' : 'Record Sample'}
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : voiceSamples.length === 0 ? (
                <Typography color="text.secondary" textAlign="center" py={4}>
                  No voice samples yet. Record your first sample to personalize your
                  experience!
                </Typography>
              ) : (
                <List>
                  {voiceSamples.map((sample) => (
                    <ListItem
                      key={sample.id}
                      sx={{
                        border: '1px solid #ddd',
                        borderRadius: 2,
                        mb: 1,
                      }}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => handleDeleteSample(sample.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={sample.transcription || 'Processing...'}
                        secondary={
                          <>
                            Quality: {(sample.quality_score * 100).toFixed(0)}% •
                            Duration: {sample.duration_seconds.toFixed(1)}s •
                            {new Date(sample.recorded_at).toLocaleDateString()}
                          </>
                        }
                      />
                    </ListItem>
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