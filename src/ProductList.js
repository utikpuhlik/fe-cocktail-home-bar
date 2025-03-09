import React, { useState, useEffect, useCallback } from 'react';
import ProductCard from './ProductCard';
import { Container, Row, Col, Dropdown, Spinner, Form } from 'react-bootstrap';
import Select from 'react-select';
import './App.css';

const ProductList = ({ drinkType }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [labels, setLabels] = useState([]);
  const [userId, setUserId] = useState(null);
  const [sortCriteria, setSortCriteria] = useState('alcohol_content');
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // For search input
  const [loading, setLoading] = useState(false);
  const URL = process.env.REACT_APP_URL;

  // Debounce function to limit API calls
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  // Fetch labels and user info initially
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);

      try {
        const labelResponse = await fetch(`${URL}/labels`);
        const labelData = await labelResponse.json();
        setLabels(labelData.map(label => ({ value: label.name, label: label.name })));
      } catch (error) {
        console.error('Error fetching labels:', error);
      }

      try {
        const userResponse = await fetch(`${URL}/auth/redis/me`, {
          credentials: 'include',
        });
        const userData = await userResponse.json();
        setUserId(userData.id);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }

      setLoading(false);
    };

    fetchInitialData();
  }, [URL]);

  // Fetch products based on search term with debounce
  const fetchProducts = useCallback(
      debounce(async (search) => {
        setLoading(true);
        try {
          const endpoint = search
              ? `${URL}/cocktails/search?search_term=${encodeURIComponent(search)}`
              : `${URL}/cocktails?size=100`;
          const response = await fetch(endpoint);
          const data = await response.json();
          setProducts(data.items);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
        setLoading(false);
      }, 500),
      [URL]
  );

  // Trigger product fetching based on search term
  useEffect(() => {
    fetchProducts(searchTerm);
  }, [searchTerm, fetchProducts]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter and sort products
  useEffect(() => {
    let updatedProducts = [...products];

    if (selectedLabels.length > 0) {
      const selectedLabelValues = selectedLabels.map(label => label.value);
      updatedProducts = updatedProducts.filter(product =>
          product.labels.some(label => selectedLabelValues.includes(label.name))
      );
    }

    if (drinkType) {
      updatedProducts = updatedProducts.filter(product => product.drink_type === drinkType);
    }

    if (sortCriteria === 'rating') {
      updatedProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortCriteria === 'name') {
      updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortCriteria === 'alcohol_content') {
      updatedProducts.sort((a, b) => b.alcohol_content - a.alcohol_content);
    }

    setFilteredProducts(updatedProducts);
  }, [products, selectedLabels, sortCriteria, drinkType]);

  const handleSortChange = (criteria) => {
    setSortCriteria(criteria);
  };

  const handleLabelChange = (selectedOptions) => {
    setSelectedLabels(selectedOptions || []);
  };

  return (
      <Container>
        <Row className="mb-3">
          <Col md={8}>
            <Form.Control
                type="text"
                placeholder="Search cocktails..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="mb-2"
            />
            <Select
                isMulti
                name="labels"
                options={labels}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select labels..."
                onChange={handleLabelChange}
            />
          </Col>
          <Col md={4} className="d-flex justify-content-end">
            <Dropdown>
              <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
                {sortCriteria === 'rating' ? 'Rating' : sortCriteria === 'name' ? 'Name' : 'Alcohol Content'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleSortChange('rating')}>Rating</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSortChange('name')}>Name</Dropdown.Item>
                <Dropdown.Item onClick={() => handleSortChange('alcohol_content')}>Alcohol Content</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        {loading ? (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
        ) : filteredProducts.length > 0 ? (
            <Row>
              {filteredProducts.map(product => (
                  <Col key={product.id} sm={12} md={6} lg={4} className="mb-4">
                    <ProductCard product={product} userId={userId} />
                  </Col>
              ))}
            </Row>
        ) : (
            <div className="text-center mt-5">
              <h4>No products found matching your criteria.</h4>
            </div>
        )}
      </Container>
  );
};

export default ProductList;
