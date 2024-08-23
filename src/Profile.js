import React, { useEffect, useState } from 'react';
import { Container, Alert, Button, ListGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = ({ setIsLoggedIn }) => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const URL = process.env.REACT_APP_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      try {
        // Fetch user data
        const userResponse = await axios.get(`${URL}/auth/redis/me`, {
          withCredentials: true,
        });
        setUser(userResponse.data);

        // Fetch orders for the logged-in user
        const ordersResponse = await axios.get(`${URL}/orders`, {
          withCredentials: true,
        });
        setOrders(ordersResponse.data);
      } catch (error) {
        setError('You are not logged in. Please log in to view your profile.');
        console.error("Failed to fetch user or orders:", error);
      }
    };

    fetchUserAndOrders();
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

      <h3>Your Orders</h3>
      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        <ListGroup>
          {orders.map((order) => (
            <ListGroup.Item key={order.id}>
              <p><strong>Order ID:</strong> {order.id}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Items:</strong></p>
              <ul>
                {order.order_cocktails.map((cocktail) => (
                  <li key={cocktail.id}>
                    <strong>{cocktail.name}</strong> - {cocktail.description}
                  </li>
                ))}
              </ul>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}

      <Button variant="outline-dark" onClick={handleLogout} className="mt-3">Logout</Button>
    </Container>
  );
};

export default Profile;
