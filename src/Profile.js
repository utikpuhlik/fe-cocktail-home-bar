import React, { useEffect, useState } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = ({ setIsLoggedIn }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const URL = process.env.REACT_APP_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${URL}/auth/redis/me`, {
          withCredentials: true, // Важно для отправки и получения cookies
        });
        setUser(response.data);
      } catch (error) {
        setError('You are not logged in. Please log in to view your profile.');
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, [URL]);

  const handleLogout = async () => {
    try {
      await axios.post(`${URL}/auth/redis/logout`, {}, {
        withCredentials: true,
      });
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => navigate('/login')}>Login</Button>
      </Container>
    );
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="mt-4">
      <h2>Profile</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      {/* Добавьте любые другие поля, которые хотите отобразить */}
      <Button variant="outline-dark" onClick={handleLogout} className="mt-3">Logout</Button>
    </Container>
  );
};

export default Profile;
