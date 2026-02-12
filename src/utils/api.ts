// src/utils/api.ts

const API_BASE_URL = "https://sauticare-backend-6rg6.onrender.com/api/v1";

/* -------------------------------- AUTH -------------------------------- */

// Allowed options
export type LanguagePreference = "English" | "Swahili";
export type ImpairmentType =
  | "Cerebral Palsy"
  | "Neurodevelopmental disorders"
  | "Neurological disorders"
  | "Multiple Sclerosis (MS)"
  | "Parkinson’s Disease"
  | "Autism Spectrum Disorder (ASD)"
  | "Down Syndrome";
export type SeverityLevel = "Mild" | "Moderate" | "Severe" | "Profound";

export interface SignupData {
  email: string;
  password: string;
  full_name: string;
  role: "learner" | "admin" | "teacher";
  language_preference: LanguagePreference;
  impairment_type?: ImpairmentType;
  severity_level?: SeverityLevel;
  date_of_birth?: string; // ISO string e.g., '2000-01-01'
}

export async function registerUser(data: SignupData) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || "Signup failed");
  }

  return res.json(); // { access_token, refresh_token, token_type }
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || "Login failed");
  }
  return res.json();
}

export async function logoutUser() {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || "Logout failed");
  }
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

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || "Failed to fetch current user");
  }

  return res.json();
}

export async function refreshToken(refreshToken: string) {
  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || "Token refresh failed");
  }
  return res.json();
}

// Add to existing api.ts

/* -------------------------------- VOICE -------------------------------- */

export async function uploadVoiceSample(file: File) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/voice/upload-sample`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || 'Upload failed');
  }

  return res.json();
}

export async function getVoiceSamples(limit: number = 50) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`${API_BASE_URL}/voice/samples?limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || 'Failed to fetch voice samples');
  }

  return res.json();
}

export async function deleteVoiceSample(sampleId: string) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`${API_BASE_URL}/voice/samples/${sampleId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || 'Delete failed');
  }

  return res.json();
}

/* -------------------------------- LESSONS -------------------------------- */

interface GetLessonsParams {
  language?: string;
  category?: string;
  difficulty_level?: number;
  limit?: number;
}

export async function getLessons(params: GetLessonsParams = {}) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  const queryParams = new URLSearchParams();
  if (params.language) queryParams.append('language', params.language);
  if (params.category) queryParams.append('category', params.category);
  if (params.difficulty_level)
    queryParams.append('difficulty_level', params.difficulty_level.toString());
  if (params.limit) queryParams.append('limit', params.limit.toString());

  const res = await fetch(
    `${API_BASE_URL}/lessons/?${queryParams.toString()}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || 'Failed to fetch lessons');
  }

  return res.json();
}

export async function getLessonDetail(lessonId: string) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`${API_BASE_URL}/lessons/${lessonId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || 'Failed to fetch lesson');
  }

  return res.json();
}

export async function getMyProgress() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`${API_BASE_URL}/lessons/progress/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || 'Failed to fetch progress');
  }

  return res.json();
}

export async function startLesson(lessonId: string) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(
    `${API_BASE_URL}/lessons/progress/${lessonId}/start`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || 'Failed to start lesson');
  }

  return res.json();
}

export async function updateLessonProgress(
  lessonId: string,
  completionPercentage: number
) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(
    `${API_BASE_URL}/lessons/progress/${lessonId}/update?completion_percentage=${completionPercentage}`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || 'Failed to update progress');
  }

  return res.json();
}

/* -------------------------------- PRACTICE -------------------------------- */

export async function createPracticeSession(lessonId: string) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`${API_BASE_URL}/practice/sessions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ lesson_id: lessonId }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || 'Failed to create session');
  }

  return res.json();
}

export async function submitPhraseAttempt(
  sessionId: string,
  phraseId: string,
  audioFile: File
) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  const formData = new FormData();
  formData.append('file', audioFile);

  const res = await fetch(
    `${API_BASE_URL}/practice/attempt?session_id=${sessionId}&phrase_id=${phraseId}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || 'Failed to submit attempt');
  }

  return res.json();
}

export async function endPracticeSession(sessionId: string) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(
    `${API_BASE_URL}/practice/sessions/${sessionId}/end`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || 'Failed to end session');
  }

  return res.json();
}

export async function getSessionAttempts(sessionId: string) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`${API_BASE_URL}/practice/attempts/${sessionId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || 'Failed to fetch attempts');
  }

  return res.json();
}

/* -------------------------------- ANALYTICS -------------------------------- */

export async function getDashboardAnalytics(days: number = 7) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(
    `${API_BASE_URL}/analytics/dashboard?days=${days}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || 'Failed to fetch analytics');
  }

  return res.json();
}

export async function getProgressTrend(days: number = 30) {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(
    `${API_BASE_URL}/analytics/progress-trend?days=${days}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || 'Failed to fetch trend');
  }

  return res.json();
}

export async function getAchievements() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('Not authenticated');

  const res = await fetch(`${API_BASE_URL}/analytics/achievements`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail || 'Failed to fetch achievements');
  }

  return res.json();
}
