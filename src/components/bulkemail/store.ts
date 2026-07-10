"use client";

import { create } from "zustand";
import type { EmailFormState } from "./types";

type BulkEmailStore = {
  form: EmailFormState;
  setSubject: (subject: string) => void;
  setBody: (body: string) => void;
  setRecipientMode: (mode: 'test' | 'all') => void;
  setTestEmails: (emails: string[]) => void;
  resetForm: () => void;
};

const initialState: EmailFormState = {
  subject: "",
  body: "",
  recipientMode: 'test',
  testEmails: [],
};

export const useBulkEmailStore = create<BulkEmailStore>()((set) => ({
  form: initialState,
  setSubject: (subject) => set((state) => ({ form: { ...state.form, subject } })),
  setBody: (body) => set((state) => ({ form: { ...state.form, body } })),
  setRecipientMode: (mode) => set((state) => ({ form: { ...state.form, recipientMode: mode } })),
  setTestEmails: (emails) => set((state) => ({ form: { ...state.form, testEmails: emails } })),
  resetForm: () => set({ form: initialState }),
}));
