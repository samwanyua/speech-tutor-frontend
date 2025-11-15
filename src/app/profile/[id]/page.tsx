'use client';

import React, { useState, useEffect } from 'react';
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
import SaveIcon from '@mui/icons-material/Save';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import { saveProfile, getProfile,getCurrentUser } from '@/utils/api';


export default function ProfilePage() {
  const [userId, setUserId] = useState<number | null>(null);
  const [profileData, setProfileData] = useState({
    preferred_name: '',
    age: '',
    language: 'english',
    bio: '',
    interests: '',
    location: '',
    gender: '',
    educationLevel: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({ ...profileData });

   useEffect(() => {
    async function loadUserAndProfile() {
      try {
        // Fetch current user dynamically
        const user = await getCurrentUser();
        setUserId(user.id);

        // Then fetch profile
        const data = await getProfile(user.id);
        if (data) {
          const interests = Array.isArray(data.interests) ? data.interests.join(', ') : '';
          const profile = {
            preferred_name: data.preferred_name || '',
            age: data.age || '',
            language: data.language || 'english',
            bio: data.bio || '',
            interests,
            location: data.location || '',
            gender: data.gender || '',
            educationLevel: data.educationLevel || ''
          };
          setProfileData(profile);
          setFormState(profile);
        }
      } catch (err) {
        console.error('Failed to load user/profile:', err);
      }
    }

    loadUserAndProfile();
  }, []);

  const handleEdit = () => {
    setFormState({ ...profileData });
    setIsEditing(true);
  };

  const handleSave = async () => {
  if (!userId) return;

  try {
    const savedProfile = await saveProfile({ user_id: userId, ...formState });

    // Always coerce interests to string
    const interests =
      Array.isArray(savedProfile.interests) ? savedProfile.interests.join(', ') : savedProfile.interests || '';

    setProfileData({
      preferred_name: savedProfile.preferred_name || '',
      age: savedProfile.age || '',
      language: savedProfile.language || 'english',
      bio: savedProfile.bio || '',
      interests,
      location: savedProfile.location || '',
      gender: savedProfile.gender || '',
      educationLevel: savedProfile.educationLevel || '',
    });

    setIsEditing(false); // this triggers rerender to show profile card
  } catch (err) {
    console.error('Error saving profile:', err);
    alert('Failed to save profile.');
  }
};


  const handleReset = () => {
    setFormState({ ...profileData });
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 'calc(100vh - 60px)',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        backdropFilter: 'blur(8px)',
        p: 2,
      }}
    >
      {isEditing ? (
        <Card
          elevation={5}
          sx={{
            width: '100%',
            maxWidth: 600,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            p: 3,
          }}
        >
          <CardContent>
            <Typography variant="h4" fontWeight={700} textAlign="center" sx={{ mb: 3 }}>
              Edit Profile
            </Typography>

            <Stack spacing={3}>
              <TextField
                label="Preferred Name"
                value={formState.preferred_name}
                onChange={(e) => setFormState({ ...formState, preferred_name: e.target.value })}
                fullWidth
                required
              />

              <TextField
                select
                label="Gender"
                value={formState.gender}
                onChange={(e) => setFormState({ ...formState, gender: e.target.value })}
                fullWidth
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
              </TextField>

              <TextField
                label="Location"
                value={formState.location}
                onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                fullWidth
              />

              <TextField
                select
                label="Education Level"
                value={formState.educationLevel}
                onChange={(e) => setFormState({ ...formState, educationLevel: e.target.value })}
                fullWidth
              >
                <MenuItem value="Primary School">Primary School</MenuItem>
                <MenuItem value="Secondary School">Secondary School</MenuItem>
                <MenuItem value="University/College">University/College</MenuItem>
              </TextField>

              <TextField
                label="Age"
                type="number"
                value={formState.age}
                onChange={(e) => setFormState({ ...formState, age: e.target.value })}
                fullWidth
              />

              <TextField
                select
                label="Preferred Language"
                value={formState.language}
                onChange={(e) => setFormState({ ...formState, language: e.target.value })}
                fullWidth
              >
                <MenuItem value="english">English</MenuItem>
                <MenuItem value="swahili">Swahili</MenuItem>
              </TextField>

              <TextField
                label="Bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                fullWidth
                multiline
                rows={3}
              />

              <TextField
                label="Interests"
                value={formState.interests}
                onChange={(e) => setFormState({ ...formState, interests: e.target.value })}
                fullWidth
              />

              <Stack direction="row" spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={!formState.preferred_name || !formState.age}
                >
                  Save Profile
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<RestartAltIcon />}
                  onClick={handleReset}
                >
                  Reset
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Card
          elevation={5}
          sx={{
            width: '100%',
            maxWidth: 600,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.3)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            p: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            {profileData.preferred_name  || 'Your Name'}
          </Typography>

          <Typography variant="body1">Language: {profileData.language || '-'}</Typography>
          {profileData.bio && <Typography variant="body2" sx={{ mt: 1 }}>{profileData.bio}</Typography>}
          {profileData.interests && <Typography variant="body2">Interests: {profileData.interests}</Typography>}
          {profileData.location && <Typography variant="body2">Location: {profileData.location}</Typography>}
          {profileData.gender && <Typography variant="body2">Gender: {profileData.gender}</Typography>}
          {profileData.educationLevel && <Typography variant="body2">Education Level: {profileData.educationLevel}</Typography>}

          <Button variant="outlined" sx={{ mt: 3 }} onClick={handleEdit}>
            Edit Profile
          </Button>
        </Card>
      )}
    </Box>
  );
}
