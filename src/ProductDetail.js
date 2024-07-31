import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Spinner, Alert, Button, Form } from 'react-bootstrap';
import './ProductDetail.css';

const ProductDetail = () => {
  const { cocktail_id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_URL}/cocktails/${cocktail_id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
        setSelectedImage(data.images[0].image_url); // Set the first image as the default selected image
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
    <Container className="product-detail-container">
      <div className="product-images">
        {product.images && product.images.length > 0 && (
          <div className="product-main-image">
            <img src={selectedImage} alt={product.name} />
          </div>
        )}
        {product.images && product.images.length > 1 && (
          <div className="product-thumbnails">
            {product.images.map((img, index) => (
              <img
                key={index}
                src={img.image_url}
                alt={product.name}
                onClick={() => setSelectedImage(img.image_url)}
              />
            ))}
          </div>
        )}
      </div>
      <div className="product-info">
        <h1>{product.name}</h1>
        <div className="price">1 440,00 Kč</div> {/* Hardcoded price, replace with product price if available */}
        <div className="description">{product.description}</div>
        <div className="actions">
          <Form.Select aria-label="Select size">
            <option>Select your size</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
            <option value="XL">Extra Large</option>
          </Form.Select>
          <Button variant="dark">Add to Cart</Button>
          <div className="availability">2-5 working days, free standard shipping</div>
        </div>
      </div>
    </Container>
  );
};

export default ProductDetail;
