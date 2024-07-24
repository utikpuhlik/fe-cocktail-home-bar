import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, Spinner, Alert } from 'react-bootstrap';

const ProductDetail = () => {
  const { cocktail_id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_URL}/cocktails/${cocktail_id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [cocktail_id]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!product) {
    return <Alert variant="warning">Product not found</Alert>;
  }

  return (
    <Container className="mt-4">
      <Card className="shadow-sm">
        {product.images && product.images.length > 0 && (
          <Card.Img variant="top" src={product.images[0].image_url} alt={product.name} />
        )}
        <Card.Body>
          <Card.Title>{product.name}</Card.Title>
          <Card.Text>{product.description}</Card.Text>
          <Card.Text><strong>Alcohol Content:</strong> {product.alcohol_content}%</Card.Text>
          <Card.Text><strong>Rating:</strong> {product.rating}</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ProductDetail;
