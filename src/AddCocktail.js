import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';

const AddCocktail = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    recipe: '',
    alcohol_content: '',
    labels: [],
    image_url: '',
    is_thumbnail: true,
    in_stock: true // Default value for in_stock
  });

  const [availableLabels, setAvailableLabels] = useState([]);
  const [error, setError] = useState(null); // State to hold error message
  const navigate = useNavigate();
  const URL = process.env.REACT_APP_URL;

  useEffect(() => {
    fetch(`${URL}/labels`)
      .then(response => response.json())
      .then(data => setAvailableLabels(data.map(label => ({ value: label.name, label: label.name }))))
      .catch(error => console.error('Error fetching labels:', error));
  }, [URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLabelChange = (selectedOptions) => {
    setFormData({
      ...formData,
      labels: selectedOptions.map(option => ({ name: option.value })),
    });
  };

  const handleStockChange = (e) => {
    setFormData({
      ...formData,
      in_stock: e.target.value === 'true', // Convert string to boolean
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      description: formData.description,
      recipe: formData.recipe,
      alcohol_content: parseFloat(formData.alcohol_content),
      labels: formData.labels,
      images: [
        {
          image_url: formData.image_url,
          is_thumbnail: formData.is_thumbnail,
        }
      ],
      in_stock: formData.in_stock // Include in_stock in the request body
    };

    fetch(`${URL}/cocktail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Failed to add cocktail. Please try again.'); // Set error message
      });
  };

  return (
    <Container>
      <h2>Add New Cocktail</h2>
      {error && <Alert variant="danger">{error}</Alert>} {/* Display error message */}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" name="description" value={formData.description} onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="recipe">
          <Form.Label>Recipe</Form.Label>
          <Form.Control type="text" name="recipe" value={formData.recipe} onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="alcohol_content">
          <Form.Label>Alcohol Content</Form.Label>
          <Form.Control type="number" step="1" name="alcohol_content" value={formData.alcohol_content} onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="labels">
          <Form.Label>Labels</Form.Label>
          <Select
            isMulti
            name="labels"
            options={availableLabels}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="Select labels..."
            onChange={handleLabelChange}
          />
        </Form.Group>
        <Form.Group controlId="image_url">
          <Form.Label>Image URL</Form.Label>
          <Form.Control type="text" name="image_url" value={formData.image_url} onChange={handleChange} required />
        </Form.Group>
        <Form.Group controlId="in_stock">
          <Form.Label>In Stock</Form.Label>
          <Form.Select name="in_stock" value={formData.in_stock.toString()} onChange={handleStockChange} required>
            <option value="true">True</option>
            <option value="false">False</option>
          </Form.Select>
        </Form.Group>
        <Button variant="dark" type="submit" className="mt-3">Add Cocktail</Button>
      </Form>
    </Container>
  );
};

export default AddCocktail;
