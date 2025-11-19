// src/utils/api.ts

const API_BASE_URL =
  "https://sauticare-backend-kul56wnfo-sams-projects-7b510dbf.vercel.app/api";

/* -------------------------------- AUTH -------------------------------- */

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function registerUser(
  name: string,
  email: string,
  password: string
) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) throw new Error("Signup failed");
  return res.json();
}

export async function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch current user");
  return res.json();
}

/* ------------------------------- LESSONS ------------------------------- */

export async function fetchLevels() {
  const res = await fetch(`${API_BASE_URL}/lessons/levels`);
  if (!res.ok) throw new Error("Failed to fetch lesson levels");
  return res.json();
}

export async function fetchLessonsByDifficulty(difficulty: string) {
  const res = await fetch(`${API_BASE_URL}/lessons/${difficulty}`);
  if (!res.ok) throw new Error(`Failed to fetch ${difficulty} lessons`);
  return res.json();
}

/* ------------------------------- FEEDBACK ------------------------------ */

export async function submitFeedback(
  userId: number,
  lessonId: string,
  comment: string
) {
  const res = await fetch(`${API_BASE_URL}/feedback/score`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      lesson_id: lessonId,
      comment,
    }),
  });

  if (!res.ok) throw new Error("Failed to submit feedback");
  return res.json();
}

/* --------------------------- SPEECH TO TEXT ---------------------------- */

export async function speechToText(audioData: Blob) {
  const formData = new FormData();
  formData.append("file", audioData);

  const res = await fetch(`${API_BASE_URL}/stt/transcribe`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("STT failed");
  return res.json();
}

/* --------------------------- TEXT TO SPEECH ---------------------------- */

export async function textToSpeech(text: string) {
  const res = await fetch(
    `${API_BASE_URL}/tts/speak?text=${encodeURIComponent(text)}`
  );

  if (!res.ok) throw new Error("TTS failed");
  return res.blob(); // audio output
}

/* -------------------------------- PROFILE ------------------------------ */

export async function getProfile(userId: number) {
  const res = await fetch(`${API_BASE_URL}/profile/${userId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) return null;
  return res.json();
}

export async function saveProfile(profileData: any) {
  const res = await fetch(`${API_BASE_URL}/profile/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
  });

  if (!res.ok) throw new Error("Failed to save profile");
  return res.json();
}

/* -------------------------------- DASHBOARD ---------------------------- */

export async function getDashboardData(learnerId: number | string) {
  const res = await fetch(`${API_BASE_URL}/dashboard/${learnerId}`);

  if (!res.ok) throw new Error("Failed to fetch learner dashboard");
  return res.json();
}
