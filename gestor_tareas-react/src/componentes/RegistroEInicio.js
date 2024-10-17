import '../styleTareas.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
        alert("Las contraseñas no coinciden");
        return;
    }

    fetch("http://localhost:8081/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: registerData.username,
            password: registerData.password,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Registro exitoso");
            navigate('/tareas');
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error("Error al registrar:", error);
    });
};


const handleLoginSubmit = (e) => {
  e.preventDefault();

  fetch("http://localhost:8081/api/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({
          username: loginData.username,
          password: loginData.password,
      }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem('userId', data.userId); // Ajusta según la respuesta del backend
      alert("Inicio de sesión exitoso");
      navigate('/tareas');
      }else {
          alert(data.message);
      }
  })
  .catch(error => {
      console.error("Error al iniciar sesión:", error);
  });
};


  return (
    <div className="container"> {/* Usamos container en lugar de auth-container */}
      <div className="form-container">
        <h2>Crear Cuenta</h2>
        <form onSubmit={handleRegisterSubmit}>
          <label>Usuario:</label>
          <input
            type="text"
            name="username"
            value={registerData.username}
            onChange={handleRegisterChange}
            required
          />
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={registerData.password}
            onChange={handleRegisterChange}
            required
          />
          <label>Confirmar Contraseña:</label>
          <input
            type="password"
            name="confirmPassword"
            value={registerData.confirmPassword}
            onChange={handleRegisterChange}
            required
          />
          <button type="submit">Registrarse</button>
        </form>
      </div>

      <div className="form-container">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleLoginSubmit}>
          <label>Usuario:</label>
          <input
            type="text"
            name="username"
            value={loginData.username}
            onChange={handleLoginChange}
            required
          />
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={loginData.password}
            onChange={handleLoginChange}
            required
          />
          <button type="submit">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
