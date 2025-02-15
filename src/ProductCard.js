import React, { useState } from 'react';
import { Card, Button, Form, Badge, Alert, Container, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './App.css';

const ProductCard = ({ product }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false); // State for modal visibility
  const [userName, setUserName] = useState(''); // State for user's name
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages

  const image = product.images.find(image => image.is_thumbnail);
  const imagePlaceholder = 'https://chibisafe.eucalytics.uk/N2KCFkixOWWs.png';

  const handleOrderClick = () => {
    setShowOrderModal(true);
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();

    if (userName.trim() === '') {
      setErrorMessage('Please enter your name to place an order.');
      return;
    }

    const orderData = {
      status: 'pending',
      cocktail_ids: [product.id],
      user_name: userName.trim(),
    };

    fetch(`${process.env.REACT_APP_URL}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
          setShowSuccess(true);
          setErrorMessage('');
          setUserName(''); // Reset the name field
          setShowOrderModal(false); // Close the modal
          setTimeout(() => setShowSuccess(false), 3000);
        })
        .catch(error => {
          console.error('Error creating order:', error);
          setErrorMessage('Failed to place order. Please try again.');
        });
  };

  const handleError = (e) => {
    e.target.src = imagePlaceholder;
  };

  const handleModalClose = () => {
    setShowOrderModal(false);
    setErrorMessage('');
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
            <Card.Text className="card-description">{product.description}</Card.Text>
            <Card.Text>
              <strong>Alcohol Content:</strong> {product.alcohol_content}%
            </Card.Text>
            <Card.Text>
              <strong>Rating:</strong>{' '}
              {product.rating !== null ? product.rating.toFixed(1) : 'N/A'}
            </Card.Text>
            <div className="d-flex">
              {product.labels.map(label => (
                  <Badge key={label.id} bg="dark" className="me-1">
                    {label.name}
                  </Badge>
              ))}
            </div>
            <div className="d-flex justify-content-between align-items-center w-100 mt-2">
              <Link
                  to={`/cocktails/${product.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Button variant="outline-dark" className="me-2">
                  View Details
                </Button>
              </Link>
              <Button variant="dark" onClick={handleOrderClick}>
                Order
              </Button>
            </div>
          </Card.Body>
        </Card>

        {/* Order Modal */}
        <Modal show={showOrderModal} onHide={handleModalClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Place Your Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {errorMessage && (
                <Alert variant="danger">
                  {errorMessage}
                </Alert>
            )}
            <Form onSubmit={handleOrderSubmit}>
              <Form.Group controlId="userName">
                <Form.Label>Your Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={userName}
                    onChange={e => setUserName(e.target.value)}
                    required
                />
              </Form.Group>
              <Button variant="dark" type="submit" className="mt-3">
                Submit Order
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
  );
};

export default ProductCard;
