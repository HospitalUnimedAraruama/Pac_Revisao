import { Routes, Route, BrowserRouter, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import "./App.css";
import PacAvaliacao from "./components/PacAvaliacao";
import FormLogin from "./components/Login/Login";

const isAuthenticated = () => {
  const encryptedToken = localStorage.getItem("user");

  if (!encryptedToken) return false;

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedToken, "chave-secreta");
    const decryptedToken = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    if (!decryptedToken || typeof decryptedToken !== "object") return false;

    const currentTime = Math.floor(Date.now() / 1000);

    if (!decryptedToken.exp) {
      decryptedToken.exp = currentTime + 30 * 60;
      const updatedToken = CryptoJS.AES.encrypt(
        JSON.stringify(decryptedToken),
        "chave-secreta"
      ).toString();
      localStorage.setItem("user", updatedToken);
    }

    const timeLeft = decryptedToken.exp - currentTime;

    if (timeLeft <= 0) {
      localStorage.removeItem("user");
      return false;
    }

    return true;
  } catch (e) {
    console.error("Erro ao verificar o token:", e);
    return false;
  }
};


const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

const RedirectToHomeIfAuthenticated = () => {
  if (isAuthenticated()) {
    return <Navigate to="/pacientes" />;
  }
  return <FormLogin />;
};

const AuthWatcher = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAuthenticated()) {
        console.log("Sessão expirada. Redirecionando...");
        localStorage.removeItem("user");
        navigate("/"); 
      }
    }, 360); 
    return () => clearInterval(interval);
  }, []);

  return null; 
};

function App() {
  return (
    <BrowserRouter>
      <AuthWatcher /> 
      <Routes>
        <Route path="/" element={<RedirectToHomeIfAuthenticated />} />
        <Route path="/pacientes" element={<ProtectedRoute element={<PacAvaliacao />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
