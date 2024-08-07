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
  const [showUpdateForm, setShowUpdateForm] = useState(false); // State to show/hide the update form

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

  const handleUpdateClick = () => {
    setShowUpdateForm(!showUpdateForm);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    // Convert form data to JSON object
    const updatedProduct = Object.fromEntries(formData.entries());

    // Convert labels and images to lists
    updatedProduct.labels = updatedProduct.labels.split(',').map(label => ({ name: label.trim() }));
    updatedProduct.images = updatedProduct.images.split(',').map(image_url => ({ image_url: image_url.trim(), is_thumbnail: true }));

    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/cocktails/${cocktail_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setProduct(data);
      setShowUpdateForm(false); // Hide the update form after successful update
    } catch (err) {
      setError(err.message);
    }
  };

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
        <Button variant="outline-dark" className="mt-3" onClick={handleUpdateClick}>
          {showUpdateForm ? 'Cancel Update' : 'Update Cocktail'}
        </Button>
      </div>
      {showUpdateForm && (
        <div className="update-form mt-4">
          <h2>Update Cocktail</h2>
          <Form onSubmit={handleUpdateSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" defaultValue={product.name} required />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control type="text" name="description" defaultValue={product.description} required />
            </Form.Group>
            <Form.Group controlId="rating">
              <Form.Label>Rating</Form.Label>
              <Form.Control type="number" step="0.1" name="rating" defaultValue={product.rating} required />
            </Form.Group>
            <Form.Group controlId="recipe">
              <Form.Label>Recipe</Form.Label>
              <Form.Control type="text" name="recipe" defaultValue={product.recipe} required />
            </Form.Group>
            <Form.Group controlId="alcohol_content">
              <Form.Label>Alcohol Content</Form.Label>
              <Form.Control type="number" step="0.1" name="alcohol_content" defaultValue={product.alcohol_content} required />
            </Form.Group>
            <Form.Group controlId="labels">
              <Form.Label>Labels</Form.Label>
              <Form.Control type="text" name="labels" defaultValue={product.labels.map(label => label.name).join(', ')} required />
            </Form.Group>
            <Form.Group controlId="images">
              <Form.Label>Image URL</Form.Label>
              <Form.Control type="text" name="images" defaultValue={product.images.map(image => image.image_url).join(', ')} required />
            </Form.Group>
            <Button variant="dark" type="submit" className="mt-3">
              Update Cocktail
            </Button>
          </Form>
        </div>
      )}
    </Container>
  );
};

export default ProductDetail;
