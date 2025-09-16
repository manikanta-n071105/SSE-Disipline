"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      // signIn returns an object when redirect: false
      if (res?.error) {
        setError(res.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      // success: redirect to dashboard or intended page
      router.push("/profile");
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* header */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold">
            S
          </div>
          <h1 className="mt-4 text-2xl font-semibold text-black">Sign in</h1>
          <p className="mt-1 text-sm text-black/75 text-center">
            Welcome back — please sign in to your account
          </p>
        </div>

        {/* form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-black mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-medium transition ${
              loading ? "bg-blue-400 cursor-wait" : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
            disabled={loading}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        {/* extra actions */}
        <div className="mt-6">
          <div className="flex items-center">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="px-3 text-sm text-black/70">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* If you use OAuth, enable this button and configure provider */}
          {/* <button className="mt-4 w-full border border-gray-300 rounded-lg py-2 flex items-center justify-center gap-2 hover:bg-gray-50">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path ... /></svg>
            Sign in with Google
          </button> */}

          <p className="mt-4 text-sm text-black/75 text-center">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
