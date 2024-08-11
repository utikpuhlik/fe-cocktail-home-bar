import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Badge, Alert, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './App.css';

const ProductCard = ({ product }) => {
  const [userId, setUserId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false); // State to control the visibility of the success message
  const image = product.images.find(image => image.is_thumbnail);
  const imagePlaceholder = 'https://chibisafe.eucalytics.uk/N2KCFkixOWWs.png';

  useEffect(() => {
    // Fetch the user ID when the component loads
    fetch(`${process.env.REACT_APP_URL}/auth/redis/me`, {
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => {
        setUserId(data.id); // Save the user ID
      })
      .catch(error => {
        console.error('Error fetching user ID:', error);
      });
  }, []);

  const handleMakeOrder = (e) => {
    e.preventDefault();

    if (!userId) {
      console.error('User ID is not available');
      return;
    }

    const orderData = {
      user_id: userId,
      status: 'pending',
      cocktail_ids: [product.id]
    };

    fetch(`${process.env.REACT_APP_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(orderData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to create order');
        }
        return response.json();
      })
      .then(data => {
        console.log('Order created successfully:', data);
        setShowSuccess(true); // Show the success message
        setTimeout(() => setShowSuccess(false), 3000); // Hide the success message after 3 seconds
      })
      .catch(error => {
        console.error('Error creating order:', error);
        alert('Failed to place order. Please try again.');
      });
  };

  const handleError = (e) => {
    e.target.src = imagePlaceholder;
  };

  return (
    <Container className="p-0">
      {showSuccess && (
        <Alert variant="success" className="my-3">
          Order placed successfully!
        </Alert>
      )}
      <Card className="h-100 shadow-sm">
        <div className="card-img-container">
          <Card.Img
            variant="top"
            src={image ? image.image_url : imagePlaceholder}
            alt={product.name}
            onError={handleError}
          />
        </div>
        <Card.Body className="d-flex justify-content-end align-items-start flex-column gap-2">
          <Card.Title>{product.name}</Card.Title>
          <Card.Text className="h-100">{product.description}</Card.Text>
          <Card.Text><strong>Alcohol Content:</strong> {product.alcohol_content}%</Card.Text>
          <Card.Text><strong>Rating:</strong> {product.rating}</Card.Text>
          <div className="d-flex">
            {product.labels.map(label => (
              <Badge key={label.id} bg="dark" className="me-1">{label.name}</Badge>
            ))}
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <Link to={`/cocktails/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Button variant="outline-dark" className="me-2">View Details</Button>
            </Link>
            <Form onSubmit={handleMakeOrder} className="d-flex align-items-center">
              <Button type="submit" variant="dark">Order</Button>
            </Form>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductCard;
