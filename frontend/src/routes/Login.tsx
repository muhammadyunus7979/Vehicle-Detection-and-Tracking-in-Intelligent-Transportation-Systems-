import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { login as loginApi } from "../api/authApi";
import axios from "axios";

const Login = () => {
  const { login: persistUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const session = await loginApi(email, password);
      persistUser({
        id: session.userId,
        email: session.email,
        token: session.token
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      // Supabase errors come as regular Error objects; show a concise message
      const message =
        (axios.isAxiosError(err) && err.message) ||
        (err as Error)?.message ||
        "Login failed. Please try again.";
      setError(message);
      // eslint-disable-next-line no-console
      console.error("Login failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white text-gray-900 dark:bg-slate-950 dark:text-slate-100">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-md flex-col gap-4 rounded-lg border border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-900 p-8 shadow-lg"
      >
        <h1 className="text-2xl font-semibold">Vehicle Detection Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-slate-400">
          Sign in to your account to continue.
        </p>
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-gray-900 dark:text-slate-100 outline-none focus:border-indigo-400"
            placeholder="your@email.com"
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-gray-900 dark:text-slate-100 outline-none focus:border-indigo-400"
            placeholder="••••••••"
            required
          />
        </label>
        {error && <p className="text-sm text-red-500 dark:text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded bg-indigo-500 px-4 py-2 font-medium text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:bg-indigo-800"
        >
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-center text-sm text-gray-600 dark:text-slate-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-indigo-500 hover:text-indigo-400 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

