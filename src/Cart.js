import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, ListGroup, Image, Alert } from 'react-bootstrap';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const URL = process.env.REACT_APP_URL;

  useEffect(() => {
    // Fetch the cart data when the component loads
    fetch(`${URL}/cart`, {
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        setCart(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching cart data:', error);
        setError('Failed to load cart data. Please try again later.');
        setLoading(false);
      });
  }, [URL]);

  const handleQuantityChange = (index, quantity) => {
    const updatedCartItems = [...cart.cart_items];
    updatedCartItems[index].quantity = quantity;
    setCart({ ...cart, cart_items: updatedCartItems });
  };

  const handleRemoveItem = (index) => {
    const updatedCartItems = cart.cart_items.filter((_, i) => i !== index);
    setCart({ ...cart, cart_items: updatedCartItems });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!cart || cart.cart_items.length === 0) {
    return (
      <Container className="mt-4">
        <Alert variant="info">Your cart is empty.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>Your Cart</h2>
      <ListGroup variant="flush">
        {cart.cart_items.map((item, index) => (
          <ListGroup.Item key={item.cocktail.id}>
            <Row>
              <Col md={2}>
                <Image src={item.cocktail.images[0]?.image_url || 'https://via.placeholder.com/150'} alt={item.cocktail.name} fluid rounded />
              </Col>
              <Col md={4}>
                <h4>{item.cocktail.name}</h4>
                <p>{item.cocktail.description}</p>
              </Col>
              <Col md={3}>
                <Form.Control
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(index, parseInt(e.target.value))}
                  min="1"
                />
              </Col>
              <Col md={3} className="d-flex align-items-center">
                <Button variant="danger" onClick={() => handleRemoveItem(index)}>
                  Remove
                </Button>
              </Col>
            </Row>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <div className="d-flex justify-content-end mt-4">
        <Button variant="success">Proceed to Checkout</Button>
      </div>
    </Container>
  );
};

export default Cart;
