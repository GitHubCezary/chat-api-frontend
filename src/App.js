import React, { useState } from "react";
import LoginForm from "./LoginForm";
import Chat from "./Chat";
import RegistrationForm from "./RegistrationForm";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

const App = () => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const handleLogin = (user) => {
    setLoggedIn(true);
    setUsername(user);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUsername("");
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/login"
            element={
              <LoginForm isLoggedIn={isLoggedIn} onLogin={handleLogin} />
            }
          />
          <Route
            path="/register"
            element={<RegistrationForm onRegister={handleLogin} />}
          />
          <Route
            path="/chat"
            element={
              isLoggedIn ? (
                <Chat username={username} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
