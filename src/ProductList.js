import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Container, Row, Col, Dropdown, Pagination } from 'react-bootstrap';
import Select from 'react-select';
import './App.css'; // Ensure you import your CSS file

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [labels, setLabels] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortCriteria, setSortCriteria] = useState('alcohol_content'); // Default sorting by alcohol content
  const [selectedLabels, setSelectedLabels] = useState([]);
  const itemsPerPage = 12;
  const URL = process.env.REACT_APP_URL;

  useEffect(() => {
    fetch(`${URL}/cocktails`)
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));

    fetch(`${URL}/labels`)
      .then(response => response.json())
      .then(data => setLabels(data.map(label => ({ value: label.name, label: label.name }))))
      .catch(error => console.error('Error fetching labels:', error));
  }, [URL]);

  const handleSortChange = (criteria) => {
    setSortCriteria(criteria);
  };

  const handleLabelChange = (selectedOptions) => {
    setSelectedLabels(selectedOptions);
  };

  // Filter and sort products based on selected labels and criteria
  const filteredProducts = selectedLabels.length > 0
    ? products.filter(product =>
        product.labels.some(label =>
          selectedLabels.some(selectedLabel => selectedLabel.value === label.name)
        )
      )
    : products;

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortCriteria === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortCriteria === 'rating') {
      return b.rating - a.rating;
    } else if (sortCriteria === 'alcohol_content') {
      return b.alcohol_content - a.alcohol_content;
    } else {
      return 0;
    }
  });

  // Calculate total pages
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

  // Get current products
  const currentProducts = sortedProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Container>
      <Row className="mb-3">
        <Col md={8}>
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
              {sortCriteria === 'rating' ? 'Rating' : sortCriteria === 'name' ? 'Name' : sortCriteria === 'alcohol_content' ? 'Alcohol Content' : 'Label'}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleSortChange('rating')}>Rating</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSortChange('name')}>Name</Dropdown.Item>
              <Dropdown.Item onClick={() => handleSortChange('alcohol_content')}>Alcohol Content</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row>
        {currentProducts.map(product => (
          <Col key={product.id} sm={12} md={6} lg={4} className="mb-4">
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
      <div className="pagination-container">
        <Pagination>
          <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
      </div>
    </Container>
  );
};

export default ProductList;
