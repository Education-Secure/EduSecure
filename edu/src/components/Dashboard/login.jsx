import React, { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = ({ onCreateAccountClick }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        navigate("/index"); // Changed from "/home" to "/index"
      }
    });
    return () => unsubscribe(); // cleanup
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // no manual navigate, onAuthStateChanged handles redirect
    } catch (err) {
      setError(err.message || "An unknown error occurred");
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // redirect handled by onAuthStateChanged
    } catch (err) {
      setError(err.message || "An unknown error occurred during Google sign-in");
    }
  };

  return (
    <section className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <input
          data-testid="email-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="login-email"
        />
        <input
          data-testid="password-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-password"
        />
        <button type="submit" className="login-submit">
          Login
        </button>
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="google-signin"
        >
          <img
            src="https://th.bing.com/th/id/OIP.Din44az7iZZDfbsrD1kfGQHaHa?rs=1&pid=ImgDetMain"
            alt="Google Logo"
          />
          Sign in with Google
        </button>
        {error && <p className="login-error">{error}</p>}
      </form>
      <section className="no-account">
        <p>
          Don't have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onCreateAccountClick();
            }}
            className="to-signup"
          >
            Create an account
          </a>
        </p>
      </section>
    </section>
  );
};

export default Login;