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
