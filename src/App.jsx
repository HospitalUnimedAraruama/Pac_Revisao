import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import CryptoJS from 'crypto-js'; // Importa a biblioteca para descriptografar
import './App.css';
import PacAvaliacao from "./components/PacAvaliacao";
import FormLogin from "./components/Login/Login";

// Função para verificar se o token está válido (não expirado)
const isAuthenticated = () => {
  const encryptedToken = localStorage.getItem('user');

  if (!encryptedToken) return false;

  try {
    // Descriptografando o token
    const bytes = CryptoJS.AES.decrypt(encryptedToken, 'chave-secreta');
    const decryptedToken = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    // Verifica a expiração do token
    const currentTime = Date.now() / 1000; // Tempo atual em segundos
    if (decryptedToken.exp < currentTime) {
      // Se o token estiver expirado, remove o token e retorna false
      localStorage.removeItem('user');
      return false;
    }

    return true;
  } catch (e) {
    // Caso ocorra algum erro ao decodificar o token, considera o token inválido
    return false;
  }
};

// Componente protegido que só permite acesso se o usuário estiver autenticado
const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

// Componente de login com redirecionamento se o usuário já estiver logado
const RedirectToHomeIfAuthenticated = () => {
  if (isAuthenticated()) {
    return <Navigate to="/pacientes" />;
  }
  return <FormLogin />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RedirectToHomeIfAuthenticated />} />
        <Route path="/pacientes" element={<ProtectedRoute element={<PacAvaliacao />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
