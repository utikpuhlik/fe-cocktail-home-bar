import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Spinner,
  Alert,
  Button,
  Form,
  Row,
  Col,
  Card,
  Image,
  Badge,
} from 'react-bootstrap';
import Select from 'react-select'; // Import react-select
import './ProductDetail.css';

const ProductDetail = () => {
  const { cocktail_id } = useParams();
  const [product, setProduct] = useState(null);
  const [availableLabels, setAvailableLabels] = useState([]); // State for available labels
  const [selectedLabels, setSelectedLabels] = useState([]); // State for selected labels
  const [loading, setLoading] = useState(true);
  const [labelsLoading, setLabelsLoading] = useState(true); // State for labels loading
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [userRating, setUserRating] = useState(null);
  const [newRating, setNewRating] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // State to track login status

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

        // Initialize selected labels for the update form
        setSelectedLabels(
          cocktail.labels.map((label) => ({ value: label.id, label: label.name }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchRating = async () => {
      try {
        const response = await fetch(`${URL}/ratings/${cocktail_id}/user`, {
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

    const checkLoginStatus = async () => {
      try {
        const response = await fetch(`${URL}/auth/redis/me`, {
          credentials: 'include',
        });
        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error('Error checking login status:', err);
        setIsLoggedIn(false);
      }
    };

    const fetchAvailableLabels = async () => {
      try {
        const response = await fetch(`${URL}/labels`);
        if (!response.ok) {
          throw new Error('Failed to fetch labels');
        }
        const labelsData = await response.json();
        const labelsOptions = labelsData.map((label) => ({
          value: label.id,
          label: label.name,
        }));
        setAvailableLabels(labelsOptions);
      } catch (err) {
        console.error('Error fetching labels:', err);
      } finally {
        setLabelsLoading(false);
      }
    };

    fetchProduct();
    fetchRating();
    checkLoginStatus();
    fetchAvailableLabels();
  }, [cocktail_id, URL]);

  const handleUpdateClick = () => {
    setShowUpdateForm(!showUpdateForm);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const updatedProduct = Object.fromEntries(formData.entries());

    // Use selectedLabels state to get labels
    updatedProduct.labels = selectedLabels.map((label) => ({
      id: label.value,
      name: label.label,
    }));

    // Handle images
    updatedProduct.images = updatedProduct.images
      .split(',')
      .map((image_url) => ({ image_url: image_url.trim(), is_thumbnail: true }));

    // Parse alcohol_content to float
    updatedProduct.alcohol_content = parseFloat(updatedProduct.alcohol_content);

    try {
      const response = await fetch(`${URL}/cocktails/${cocktail_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include credentials for authentication
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
        credentials: 'include', // Include credentials for authentication
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

  if (loading || labelsLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: '300px' }}
      >
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!product) {
    return <Alert variant="warning">Cocktail not found</Alert>;
  }

  return (
    <Container className="product-detail-container">
      <Row className="my-4">
        <Col md={6}>
          <Card className="mb-4">
            {selectedImage && (
              <Card.Img variant="top" src={selectedImage} alt={product.name} />
            )}
            {product.images && product.images.length > 1 && (
              <Card.Body>
                <div className="d-flex flex-wrap">
                  {product.images.map((img, index) => (
                    <Image
                      key={index}
                      src={img.image_url}
                      alt={product.name}
                      thumbnail
                      className="me-2 mb-2"
                      style={{
                        cursor: 'pointer',
                        width: '75px',
                        height: '75px',
                        objectFit: 'cover',
                      }}
                      onClick={() => setSelectedImage(img.image_url)}
                    />
                  ))}
                </div>
              </Card.Body>
            )}
          </Card>
        </Col>
        <Col md={6}>
          <h1>{product.name}</h1>
          <p>
            <strong>Description:</strong> {product.description}
          </p>
          <p>
            <strong>Alcohol Content:</strong> {product.alcohol_content}%
          </p>
          <p>
            <strong>Labels:</strong>{' '}
            {product.labels.map((label) => (
              <Badge key={label.id} bg="dark" className="me-1">
                {label.name}
              </Badge>
            ))}
          </p>
          <p>
            <strong>Recipe:</strong>
            <br />
            {product.recipe ? (
              product.recipe.split('\\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))
            ) : (
              <span>No recipe available</span>
            )}
          </p>
          {isLoggedIn && (
            <Button variant="outline-dark" className="mt-3" onClick={handleUpdateClick}>
              {showUpdateForm ? 'Cancel Update' : 'Update Cocktail'}
            </Button>
          )}
        </Col>
      </Row>

      {isLoggedIn && showUpdateForm && (
        <Row className="update-form mt-4">
          <Col>
            <h2>Update Cocktail</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleUpdateSubmit}>
              <Form.Group controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" defaultValue={product.name} required />
              </Form.Group>
              <Form.Group controlId="description" className="mt-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  defaultValue={product.description}
                  required
                />
              </Form.Group>
              <Form.Group controlId="recipe" className="mt-3">
                <Form.Label>Recipe</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  name="recipe"
                  defaultValue={product.recipe}
                />
              </Form.Group>
              <Form.Group controlId="alcohol_content" className="mt-3">
                <Form.Label>Alcohol Content</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  name="alcohol_content"
                  defaultValue={product.alcohol_content}
                  required
                />
              </Form.Group>
              <Form.Group controlId="labels" className="mt-3">
                <Form.Label>Labels</Form.Label>
                <Select
                  isMulti
                  options={availableLabels}
                  value={selectedLabels}
                  onChange={(selectedOptions) => setSelectedLabels(selectedOptions)}
                  className="basic-multi-select"
                  classNamePrefix="select"
                  placeholder="Select labels..."
                />
              </Form.Group>
              <Form.Group controlId="images" className="mt-3">
                <Form.Label>Image URLs</Form.Label>
                <Form.Control
                  type="text"
                  name="images"
                  defaultValue={product.images.map((image) => image.image_url).join(', ')}
                  required
                />
              </Form.Group>
              <Button variant="dark" type="submit" className="mt-3">
                Update Cocktail
              </Button>
            </Form>
          </Col>
        </Row>
      )}

      <Row className="rating-section mt-4">
        <Col md={6}>
          <h2>Rate this Cocktail</h2>
          <p>
            Your current rating:{' '}
            {userRating !== null ? userRating : 'You have not rated this cocktail yet.'}
          </p>
          {isLoggedIn ? (
            <>
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
            </>
          ) : (
            <p>Please log in to rate this cocktail.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;
