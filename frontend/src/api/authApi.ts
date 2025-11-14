import { supabase } from "../lib/supabase";

export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.session || !data.user) {
    throw error ?? new Error("Login failed");
  }
  return {
    token: data.session.access_token,
    userId: data.user.id,
    email: data.user.email as string
  };
};

export const register = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.session || !data.user) {
    throw error ?? new Error("Sign up failed");
  }
  return {
    token: data.session.access_token,
    userId: data.user.id,
    email: data.user.email as string
  };
};

