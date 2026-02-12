'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  LinearProgress,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import {
  getLessonDetail,
  startLesson,
  createPracticeSession,
  submitPhraseAttempt,
  endPracticeSession,
  updateLessonProgress,
} from '@/utils/api';

interface Phrase {
  id: string;
  phrase_text: string;
  difficulty_level: number;
  sequence_order: number;
  phonetic_transcription?: string;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  category: string;
  language: string;
  difficulty_level: number;
  content: any;
  phrases: Phrase[];
}

interface AttemptResult {
  transcription: string;
  pronunciation_score: number;
  confidence_score: number;
  feedback: any;
}

export default function LessonDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Practice state
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [completedPhrases, setCompletedPhrases] = useState<Set<number>>(new Set());
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [attemptResult, setAttemptResult] = useState<AttemptResult | null>(null);

  // Recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    try {
      setLoading(true);
      const data = await getLessonDetail(lessonId);
      setLesson(data);

      // Sort phrases by sequence
      if (data.phrases) {
        data.phrases.sort((a: Phrase, b: Phrase) => a.sequence_order - b.sequence_order);
      }

      // Start lesson progress
      await startLesson(lessonId);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startPracticeSession = async () => {
    try {
      const session = await createPracticeSession(lessonId);
      setSessionId(session.id);
      setCurrentPhraseIndex(0);
      setCompletedPhrases(new Set());
      setAttemptResult(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        await processRecording();
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setAttemptResult(null);
    } catch (err: any) {
      setError('Microphone access denied. Please allow microphone access.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const processRecording = async () => {
    if (!sessionId || !lesson) return;

    try {
      setProcessing(true);

      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const audioFile = new File([audioBlob], 'recording.webm', {
        type: 'audio/webm',
      });

      const currentPhrase = lesson.phrases[currentPhraseIndex];
      const result = await submitPhraseAttempt(
        sessionId,
        currentPhrase.id,
        audioFile
      );

      setAttemptResult({
        transcription: result.transcription,
        pronunciation_score: result.pronunciation_score,
        confidence_score: result.confidence_score,
        feedback: result.feedback,
      });

      // Mark phrase as completed if score >= 70
      if (result.pronunciation_score >= 70) {
        setCompletedPhrases((prev) => new Set(prev).add(currentPhraseIndex));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const nextPhrase = () => {
    if (lesson && currentPhraseIndex < lesson.phrases.length - 1) {
      setCurrentPhraseIndex(currentPhraseIndex + 1);
      setAttemptResult(null);
    } else {
      finishLesson();
    }
  };

  const previousPhrase = () => {
    if (currentPhraseIndex > 0) {
      setCurrentPhraseIndex(currentPhraseIndex - 1);
      setAttemptResult(null);
    }
  };

  const finishLesson = async () => {
    if (!sessionId || !lesson) return;

    try {
      await endPracticeSession(sessionId);

      // Calculate completion percentage
      const completionPercentage =
        (completedPhrases.size / lesson.phrases.length) * 100;
      await updateLessonProgress(lessonId, completionPercentage);

      router.push('/lessons/my-progress');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const speakPhrase = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lesson?.language === 'sw' ? 'sw-KE' : 'en-KE';
      utterance.rate = 0.8; // Slower for learning
      window.speechSynthesis.speak(utterance);
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !lesson) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Lesson not found'}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/lessons')}
          sx={{ mt: 2 }}
        >
          Back to Lessons
        </Button>
      </Container>
    );
  }

  const currentPhrase = lesson.phrases[currentPhraseIndex];
  const progress = ((currentPhraseIndex + 1) / lesson.phrases.length) * 100;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/lessons')}
          sx={{ mb: 2 }}
        >
          Back to Lessons
        </Button>

        <Typography variant="h4" fontWeight={700} gutterBottom>
          {lesson.title}
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip label={lesson.category} size="small" />
          <Chip
            label={lesson.language === 'en-KE' ? 'English' : 'Swahili'}
            size="small"
          />
          <Chip label={`Level ${lesson.difficulty_level}`} size="small" />
        </Box>

        <Typography variant="body2" color="text.secondary">
          {lesson.description}
        </Typography>
      </Box>

      {/* Session not started */}
      {!sessionId ? (
        <Card elevation={3}>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h5" gutterBottom>
              Ready to Practice?
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              This lesson has {lesson.phrases.length} phrases to practice
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={startPracticeSession}
              startIcon={<PlayArrowIcon />}
            >
              Start Practice Session
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Progress */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Typography variant="body2">Progress</Typography>
                <Typography variant="body2" fontWeight={600}>
                  {currentPhraseIndex + 1} / {lesson.phrases.length}
                </Typography>
              </Box>
              <LinearProgress variant="determinate" value={progress} />
            </CardContent>
          </Card>

          {/* Current Phrase Card */}
          <Card elevation={3} sx={{ mb: 3 }}>
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
                  Phrase {currentPhraseIndex + 1}
                </Typography>
                <IconButton
                  onClick={() => speakPhrase(currentPhrase.phrase_text)}
                  color="primary"
                >
                  <VolumeUpIcon />
                </IconButton>
              </Box>

              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  bgcolor: 'rgba(0,0,0,0.02)',
                  textAlign: 'center',
                  borderRadius: 2,
                  mb: 3,
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 500, lineHeight: 1.6 }}
                >
                  {currentPhrase.phrase_text}
                </Typography>

                {currentPhrase.phonetic_transcription && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2, fontStyle: 'italic' }}
                  >
                    /{currentPhrase.phonetic_transcription}/
                  </Typography>
                )}
              </Paper>

              {/* Recording Controls */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                {!recording && !processing ? (
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<MicIcon />}
                    onClick={startRecording}
                    sx={{ px: 6, py: 1.5, borderRadius: 3 }}
                  >
                    Start Recording
                  </Button>
                ) : recording ? (
                  <Button
                    variant="contained"
                    color="error"
                    size="large"
                    startIcon={<StopIcon />}
                    onClick={stopRecording}
                    sx={{ px: 6, py: 1.5, borderRadius: 3 }}
                  >
                    Stop Recording
                  </Button>
                ) : (
                  <CircularProgress />
                )}
              </Box>

              {/* Attempt Result */}
              {attemptResult && (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    bgcolor:
                      attemptResult.pronunciation_score >= 70
                        ? 'rgba(76, 175, 80, 0.1)'
                        : 'rgba(255, 152, 0, 0.1)',
                    borderRadius: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2,
                    }}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      Result
                    </Typography>
                    <Chip
                      label={`${attemptResult.pronunciation_score.toFixed(0)}%`}
                      color={
                        attemptResult.pronunciation_score >= 70
                          ? 'success'
                          : 'warning'
                      }
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    What you said:
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    "{attemptResult.transcription}"
                  </Typography>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Feedback:
                  </Typography>
                  <Typography variant="body2">
                    {attemptResult.feedback?.overall || 'Keep practicing!'}
                  </Typography>

                  {attemptResult.pronunciation_score >= 70 && (
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        mt: 2,
                        color: 'success.main',
                      }}
                    >
                      <CheckCircleIcon />
                      <Typography variant="body2" fontWeight={600}>
                        Great job! You can move to the next phrase.
                      </Typography>
                    </Box>
                  )}
                </Paper>
              )}

              {/* Navigation */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mt: 3,
                }}
              >
                <Button
                  onClick={previousPhrase}
                  disabled={currentPhraseIndex === 0}
                >
                  Previous
                </Button>

                <Button
                  variant="contained"
                  onClick={nextPhrase}
                  disabled={!attemptResult}
                >
                  {currentPhraseIndex === lesson.phrases.length - 1
                    ? 'Finish'
                    : 'Next'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Phrase List */}
          <Card elevation={2}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                All Phrases
              </Typography>
              <List>
                {lesson.phrases.map((phrase, index) => (
                  <ListItem
                    key={phrase.id}
                    sx={{
                      bgcolor:
                        index === currentPhraseIndex
                          ? 'rgba(0,0,0,0.05)'
                          : 'transparent',
                      borderRadius: 1,
                      mb: 0.5,
                    }}
                  >
                    <ListItemIcon>
                      {completedPhrases.has(index) ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ width: 24, textAlign: 'center' }}
                        >
                          {index + 1}
                        </Typography>
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={phrase.phrase_text}
                      primaryTypographyProps={{
                        fontWeight: index === currentPhraseIndex ? 600 : 400,
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
}