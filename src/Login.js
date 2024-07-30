import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs'; // для преобразования объекта в строку формата URL-кодирования
import Cookies from 'js-cookie';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const URL = process.env.REACT_APP_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      grant_type: 'password',
      username: username,
      password: password,
      scope: '',
      client_id: null,
      client_secret: null,
    };

    try {
      const response = await axios.post(`${URL}/auth/redis/login`, qs.stringify(data), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        withCredentials: true, // Это важно для отправки и получения cookies
      });

      if (response.status === 204) {
        // Обработка успешного ответа
        const sessionCookie = Cookies.get('homebar-auth'); // Замените 'session' на имя вашего cookie
        console.log('Session Cookie:', sessionCookie);
        navigate('/profile');
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      setError('Login failed. Please check your username and password.');
    }
  };

  return (
    <Container>
      <h2>Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Button variant="dark" type="submit" className="mt-3">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
