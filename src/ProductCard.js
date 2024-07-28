import React, { useState } from 'react';
import { Card, Button, Form, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './App.css'; // Ensure you import your CSS file

const ProductCard = ({ product }) => {
  // Get image from product object if thumbnail is true
  const image = product.images.find(image => image.is_thumbnail);
  const imagePlaceholder = 'https://chibisafe.eucalytics.uk/N2KCFkixOWWs.png';

  const handleMakeOrder = (e) => {
    e.preventDefault();
    console.log(`Ordered`);
  };

  const handleError = (e) => {
    e.target.src = imagePlaceholder;
  };

  return (
    <Card className="h-100 shadow-sm">
      <div className="card-img-container">
        <Card.Img
          variant="top"
          src={image ? image.image_url : imagePlaceholder}
          alt={product.name}
          onError={handleError}
        />
      </div>
      <Card.Body className="d-flex flex-column">
        <Card.Title>{product.name}</Card.Title>
        <Card.Text>{product.description}</Card.Text>
        <Card.Text><strong>Alcohol Content:</strong> {product.alcohol_content}%</Card.Text>
        <Card.Text><strong>Rating:</strong> {product.rating}</Card.Text>
        {/* Add Labels */}
        <div className="mt-auto d-flex mb-2">
          {product.labels.map(label => (
            <Badge key={label.id} bg="dark" className="me-1" >{label.name}</Badge>
          ))}
        </div>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <Link to={`/cocktails/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <Button variant="outline-dark" className="me-2">View Details</Button>
          </Link>
          <Form onSubmit={handleMakeOrder} className="d-flex align-items-center">
            <Button type="submit" variant="dark">Order</Button>
          </Form>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;
