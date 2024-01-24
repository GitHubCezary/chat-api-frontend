import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegistrationForm = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      formData.username === "" ||
      formData.password === "" ||
      formData.confirmPassword === ""
    ) {
      alert("Wszystkie pola muszą być uzupełnione.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Hasła nie pasują do siebie.");
      return;
    }

    try {
      const response = await fetch("https://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (response.status === 200) {
        console.log("Zarejestrowano pomyślnie");
        alert("Zarejestrowano pomyślnie.");

        navigate("/login");
      } else {
        console.error("Błąd rejestracji");
        alert("Błąd rejestracji.");
      }
    } catch (error) {
      console.error("Błąd rejestracji:", error);
    }
  };

  return (
    <div className="registration-form">
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="username">Dodaj użytkownika:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="password">Dodaj hasło:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Potwierdź hasło:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
        </div>
        {!passwordsMatch && <p>Hasła nie pasują do siebie.</p>}
        <button type="submit">Zarejestruj się</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
