import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js'; // Importa a biblioteca para criptografar
import Style from './login.module.css';

function FormLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const users = [
    { username: 'recepcao', password: 'recAdul*$' }
  ];

  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');

  function submitUser(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    // Encontrando o usuário
    const user = users.find(
      (u) => u.username === cpf && u.password === senha
    );

    if (user) {
      // Criptografando o usuário antes de salvar no localStorage
      const encryptedUser = CryptoJS.AES.encrypt(JSON.stringify(user), 'chave-secreta').toString();
      localStorage.setItem('user', encryptedUser); // Salva no localStorage

      navigate('/pacientes');
    } else {
      setError('Credenciais inválidas. Tente novamente.');
    }

    setLoading(false);
  }

  return (
    <div className={Style.container}>
      <Form className={Style.formContainer} onSubmit={submitUser}>
        <Form.Group className={Style.formGroup}>
          <Form.Label className={Style.labelFormLogin}>Usuário</Form.Label>
          <input
            type="text"
            className={Style.inputFormLogin}
            placeholder="Usuário"
            autoComplete="username"
            maxLength={11}
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
        </Form.Group>

        <Form.Group className={Style.formGroup}>
          <Form.Label className={Style.labelFormLogin}>Senha</Form.Label>
          <input
            type="password"
            className={Style.inputFormLogin}
            placeholder="Senha"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </Form.Group>

        {loading ? (
          <Button className={Style.btnFormLogin} variant="" type="submit" disabled>
            Entrando...
          </Button>
        ) : (
          <Button className={Style.btnFormLogin} variant="" type="submit">
            Entrar
          </Button>
        )}

        {error && <div className={Style.errorMessage}>{error}</div>}
      </Form>
    </div>
  );
}

export default FormLogin;
