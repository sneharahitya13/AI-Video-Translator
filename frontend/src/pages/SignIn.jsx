import { useState } from "react";
import { supabase } from "../supabaseClient";

function SignIn({ onSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        <div className="brand">
          <div className="brand-icon">S</div>
          <span>SpeakLocal</span>
        </div>

        <div className="auth-card">
          <h2>Welcome back</h2>

          <p className="auth-subtitle">
            Sign in to continue translating your videos.
          </p>

          {errorMessage && (
            <div className="auth-error">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSignIn}>
            <label>Email address</label>

            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              className="primary-auth-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button
            className="google-button"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <span className="google-icon">G</span>
            Continue with Google
          </button>

          <p className="switch-auth">
            Don't have an account?
            <button
              type="button"
              onClick={onSignUp}
              disabled={loading}
            >
              Create account
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}

export default SignIn;