// src/utils/api.ts
import { useAuth } from '@/context/AuthContext';

const API_BASE_URL = "https://sauticare-backend-pp07lt279-sams-projects-7b510dbf.vercel.app"; 

// ---------------- Auth ----------------
export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {  
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function registerUser(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {  // <-- added /api
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.ok;
}

// ---------------- Lessons ----------------
export async function fetchLessons() {
  const res = await fetch(`${API_BASE_URL}/lessons`);
  if (!res.ok) throw new Error("Failed to fetch lessons");
  return res.json();
}

// Optional: fetch lesson by difficulty
export async function fetchLessonsByDifficulty(difficulty: string) {
  const res = await fetch(`${API_BASE_URL}/lessons/${difficulty}`);
  if (!res.ok) throw new Error(`Failed to fetch ${difficulty} lessons`);
  return res.json();
}

// ---------------- Feedback ----------------
export async function submitFeedback(userId: string, feedback: string) {
  const res = await fetch(`${API_BASE_URL}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, feedback }),
  });
  if (!res.ok) throw new Error("Failed to submit feedback");
  return res.json();
}

// ---------------- STT / TTS ----------------
export async function speechToText(audioData: Blob) {
  const formData = new FormData();
  formData.append("file", audioData);

  const res = await fetch(`${API_BASE_URL}/stt`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("STT failed");
  return res.json();
}

export async function textToSpeech(text: string) {
  const res = await fetch(`${API_BASE_URL}/tts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) throw new Error("TTS failed");
  return res.blob(); // Assuming backend returns audio file
}

// ---------------- Profile ----------------
export async function getProfile(userId?: number) {
  // if userId is provided, fetch /api/profile/{id}, else fetch /api/profile (current user)
  const url = userId ? `${API_BASE_URL}/api/profile/${userId}` : `${API_BASE_URL}/api/profile`;

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    console.error('Failed to fetch profile', res.status);
    return null;
  }

  const data = await res.json();
  return {
    preferred_name: data.preferred_name || '',
    age: data.age || '',
    language: data.language || 'english',
    bio: data.bio || '',
    interests: data.interests || '',
    location: data.location || '',
    gender: data.gender || '',
    educationLevel: data.educationLevel || '',
  };
}


export async function saveProfile(profileData: {
  user_id: number;
  preferred_name: string;
  age: string;
  language: string;
  bio: string;
  interests: string;
  location: string;
  gender: string;
  educationLevel: string 
}) {
  const res = await fetch(`${API_BASE_URL}/api/profile`, {
    method: "POST", // or PUT if your backend requires
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
  });

  if (!res.ok) {
    console.error('Failed to save profile', res.status);
    throw new Error('Failed to save profile');
  }

  // Ensure backend returns saved profile object
  const data = await res.json();
  return {
    preferred_name: data.preferred_name || '',
    age: data.age || '',
    language: data.language || 'english',
    bio: data.bio || '',
    interests: data.interests || '',
    location: data.location || '',
    gender: data.gender || '',
    educationLevel: data.educationLevel || ''
  };
}



export async function getCurrentUser() {
  // Try reading token from localStorage as a fallback
  const token = localStorage.getItem('token'); 
  if (!token) throw new Error('No token found. Please log in.');

  const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // include token in Authorization header
    },
  });

  if (!res.ok) throw new Error('Failed to fetch current user');

  return res.json(); // { id, name, email }
}


