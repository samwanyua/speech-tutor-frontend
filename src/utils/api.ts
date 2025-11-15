// src/utils/api.ts

const API_BASE_URL = "http://127.0.0.1:8000"; // or "http://localhost:8000"

// ---------------- Auth ----------------
export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {  // <-- added /api
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
