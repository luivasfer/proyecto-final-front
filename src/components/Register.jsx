import { useState } from 'react';
import axios from 'axios';
import './Register.css';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';


const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await axios.post(`${API_URL}/register`, {
        username,
        email,
        password
      });

      setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
      setUsername('');
      setEmail('');
      setPassword('');
      // Opcional: Redirigir al login después de un tiempo
      // setTimeout(() => window.location.href = '/login', 2000);
    } catch (err) {
      setError(err.res?.data?.error || 'Error al registrarse');
    }
  };

  return (
    <div className="register-container">
      <h2>Registrate</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Usuario:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;