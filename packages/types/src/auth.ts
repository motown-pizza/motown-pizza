import { AuthAction } from './enums';
import { User } from '@supabase/supabase-js';

export type SignIn = {
  formData: { email: string; otp?: string };
  options: { action?: AuthAction; redirectUrl?: string; baseUrl?: string };
};

export type SignOut = {
  options: { baseUrl: string };
};

export interface UserObject extends User {}
