import React, { useState } from "react";
import Login from "./login";
import SignUp from "./signup";
import "./Auth.css";

const Auth = () => {
  const [showLogin, setShowLogin] = useState(true);
  const [showSignup, setShowSignup] = useState(false);

  const handleCreateAccountClick = () => {
    setShowSignup(true);
    setShowLogin(false);
  };

  const handleAlreadyHaveAccountClick = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  return (
    <main className="authentication-page">
      {showLogin && (
        <Login
          isActive={showLogin}
          onCreateAccountClick={handleCreateAccountClick}
        />
      )}
      {showSignup && (
        <SignUp
          isActive={showSignup}
          onAlreadyHaveAccountClick={handleAlreadyHaveAccountClick}
        />
      )}
    </main>
  );
};

export default Auth;
