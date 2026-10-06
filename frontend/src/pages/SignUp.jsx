import { useState } from "react";
import { supabase } from "../supabaseClient";

function SignUp({ onSignIn }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = async (event) => {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      setMessage("Account created successfully.");
    } else {
      setMessage(
        "Account created. Please check your email to confirm your account."
      );
    }

    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
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
          <h2>Create your account</h2>

          <p className="auth-subtitle">
            Start translating your videos with SpeakLocal.
          </p>

          {errorMessage && (
            <div className="auth-error">
              {errorMessage}
            </div>
          )}

          {message && (
            <div className="auth-success">
              {message}
            </div>
          )}

          <form onSubmit={handleSignUp}>
            <label>Full name</label>

            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

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
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />

            <button
              className="primary-auth-button"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <button
            className="google-button"
            type="button"
            onClick={handleGoogleSignUp}
            disabled={loading}
          >
            <span className="google-icon">G</span>
            Continue with Google
          </button>

          <p className="switch-auth">
            Already have an account?
            <button
              type="button"
              onClick={onSignIn}
              disabled={loading}
            >
              Sign in
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}

export default SignUp;