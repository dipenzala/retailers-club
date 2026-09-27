"use client";
import { create } from "zustand";

export type Role = "super_admin" | "admin" | "verification_admin" | "manufacturer" | "retailer";

export type Profile = {
  id: string;
  role: Role;
  phone: string | null;
  business_name: string | null;
  city: string | null;
  is_verified: boolean;
};

type AuthState = {
  profile: Profile | null;
  setProfile: (p: Profile | null) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>((set) => ({
  profile: null,
  setProfile: (p) => set({ profile: p }),
  logout: () => set({ profile: null }),
}));
