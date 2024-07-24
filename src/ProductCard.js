import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const handleAddToCart = (e) => {
    e.preventDefault();
    console.log(`Added ${quantity} of ${product.name} to cart`);
  };

  return (
    <Card className="h-100 shadow-sm">
      <Link to={`/cocktails/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <Card.Img variant="top" src={product.images[0].image_url} alt={product.name} />
        <Card.Body className="d-flex flex-column">
          <Card.Title>{product.name}</Card.Title>
          <Card.Text>{product.description}</Card.Text>
          <Card.Text><strong>Alcohol Content:</strong> {product.alcohol_content}%</Card.Text>
          <Card.Text><strong>Rating:</strong> {product.rating}</Card.Text>
        </Card.Body>
      </Link>
      <Form onSubmit={handleAddToCart} className="mt-auto d-flex align-items-center">
        <Button type="submit" variant="dark">Add to Cart</Button>
      </Form>
    </Card>
  );
};

export default ProductCard;
