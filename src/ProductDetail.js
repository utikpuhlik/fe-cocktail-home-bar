import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Spinner, Alert, Button, Form, Row, Col } from 'react-bootstrap';
import './ProductDetail.css';

const ProductDetail = () => {
  const { cocktail_id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [rating, setRating] = useState(null);
  const [userRating, setUserRating] = useState(null); // Для хранения оценки пользователя
  const [newRating, setNewRating] = useState(0); // Для новой оценки пользователя

  const URL = process.env.REACT_APP_URL;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`${URL}/cocktails?cocktail_id=${cocktail_id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const cocktail = data.items[0];
        setProduct(cocktail);
        setSelectedImage(cocktail.images[0]?.image_url);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchRating = async () => {
      try {
        const response = await fetch(`${URL}/ratings/cocktail/${cocktail_id}`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setUserRating(data.rating);
        }
      } catch (err) {
        console.error('Error fetching rating:', err);
      }
    };

    fetchProduct();
    fetchRating();
  }, [cocktail_id, URL]);

  const handleUpdateClick = () => {
    setShowUpdateForm(!showUpdateForm);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const updatedProduct = Object.fromEntries(formData.entries());
    updatedProduct.labels = updatedProduct.labels.split(',').map(label => ({ name: label.trim() }));
    updatedProduct.images = updatedProduct.images.split(',').map(image_url => ({ image_url: image_url.trim(), is_thumbnail: true }));

    try {
      const response = await fetch(`${URL}/cocktails/${cocktail_id}`, {
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
      setShowUpdateForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRatingSubmit = async () => {
    try {
      const response = await fetch(`${URL}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          rating: newRating,
          cocktail_id: cocktail_id,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setUserRating(data.rating);
      } else {
        throw new Error('Failed to submit rating');
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError('Failed to submit rating. Please try again.');
    }
  };

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!product) {
    return <Alert variant="warning">Cocktail not found</Alert>;
  }

  return (
    <Container className="product-detail-container">
      <Row>
        <Col md={6}>
          <div className="product-images">
            {product.images && product.images.length > 0 && (
              <div className="product-main-image mb-3">
                <img src={selectedImage} alt={product.name} className="img-fluid" />
              </div>
            )}
            {product.images && product.images.length > 1 && (
              <div className="product-thumbnails">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img.image_url}
                    alt={product.name}
                    className="thumbnail-img"
                    onClick={() => setSelectedImage(img.image_url)}
                  />
                ))}
              </div>
            )}
          </div>
        </Col>
        <Col md={6}>
          <div className="product-info">
            <h1>{product.name}</h1>
            <p><strong>Description:</strong> {product.description}</p>
            <p><strong>Alcohol Content:</strong> {product.alcohol_content}%</p>
            <p><strong>Rating:</strong> {product.rating}</p>
            <p><strong>Labels:</strong> {product.labels.map(label => label.name).join(', ')}</p>
            <p><strong>Recipe:</strong><br />
              {product.recipe ? (
                product.recipe.split('\\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}<br />
                  </React.Fragment>
                ))
              ) : (
                <span>No recipe available</span>
              )}
            </p>
            <Button variant="outline-dark" className="mt-3" onClick={handleUpdateClick}>
              {showUpdateForm ? 'Cancel Update' : 'Update Cocktail'}
            </Button>
          </div>
        </Col>
      </Row>

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
              <Form.Control type="text" name="recipe" defaultValue={product.recipe} />
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
              <Form.Label>Image URLs</Form.Label>
              <Form.Control type="text" name="images" defaultValue={product.images.map(image => image.image_url).join(', ')} required />
            </Form.Group>
            <Button variant="dark" type="submit" className="mt-3">
              Update Cocktail
            </Button>
          </Form>
        </div>
      )}

      <div className="rating-section mt-4">
        <h2>Rate this Cocktail</h2>
        <p>Your current rating: {userRating !== null ? userRating : 'You have not rated this cocktail yet.'}</p>
        <Form.Group controlId="newRating">
          <Form.Label>Select a rating (0-10):</Form.Label>
          <Form.Control
            type="number"
            min="0"
            max="10"
            value={newRating}
            onChange={(e) => setNewRating(Number(e.target.value))}
          />
        </Form.Group>
        <Button variant="dark" className="mt-3" onClick={handleRatingSubmit}>
          Submit Rating
        </Button>
      </div>
    </Container>
  );
};

export default ProductDetail;
