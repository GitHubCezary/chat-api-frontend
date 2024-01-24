import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ isLoggedIn, onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/register");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://18.192.26.213:443/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        localStorage.setItem("token", data.token);
        onLogin(username);

        navigate("/chat");
      } else {
        console.error("Authentication failed");
        alert("Błąd logowania.");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="login-form">
      <form onSubmit={handleLogin}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <br />
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Login</button>
      </form>

      <div>
        <p>Nie masz jeszcze konta?</p>
        <button onClick={handleRegister}>Zarejestruj się</button>
      </div>
    </div>
  );
};

export default LoginForm;
