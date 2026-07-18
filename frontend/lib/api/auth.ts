import { fetchJson } from "@/lib/api/client";
import type {
  LoginRequest,
  LogoutRequest,
  ProfileUpdateRequest,
  SignupRequest,
  TokenOut,
  UserOut,
} from "@/lib/types";

export function signup(payload: SignupRequest): Promise<TokenOut> {
  return fetchJson<TokenOut>("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginRequest): Promise<TokenOut> {
  return fetchJson<TokenOut>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logoutRequest(payload: LogoutRequest): Promise<void> {
  return fetchJson<void>("/api/auth/logout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getMe(): Promise<UserOut> {
  return fetchJson<UserOut>("/api/auth/me");
}

export function updateProfile(payload: ProfileUpdateRequest): Promise<UserOut> {
  return fetchJson<UserOut>("/api/auth/me", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
