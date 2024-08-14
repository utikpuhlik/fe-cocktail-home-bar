import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { Container, Row, Col, Dropdown, Pagination, Spinner } from 'react-bootstrap';
import Select from 'react-select';
import './App.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [labels, setLabels] = useState([]);
  const [userId, setUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortCriteria, setSortCriteria] = useState('alcohol_content');
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [loading, setLoading] = useState(false); // State to track loading
  const itemsPerPage = 12;
  const URL = process.env.REACT_APP_URL;

  useEffect(() => {
    fetch(`${URL}/labels`)
      .then(response => response.json())
      .then(data => setLabels(data.map(label => ({ value: label.name, label: label.name }))))
      .catch(error => console.error('Error fetching labels:', error));

    fetch(`${URL}/auth/redis/me`, {
      credentials: 'include',
    })
      .then(response => response.json())
      .then(data => setUserId(data.id))
      .catch(error => {
        console.error('Error fetching user ID:', error);
      });
  }, [URL]);

  const fetchProducts = (page = 1, labelsQuery = '') => {
    setLoading(true); // Set loading to true before the fetch
    const sortQuery = sortCriteria ? `&order_by=${sortCriteria}` : '';
    fetch(`${URL}/cocktails?page=${page}&size=${itemsPerPage}${labelsQuery}${sortQuery}`)
      .then(response => response.json())
      .then(data => {
        setProducts(data.items);
        setTotalPages(data.pages);
        setLoading(false); // Set loading to false after the fetch is complete
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        setLoading(false); // Set loading to false if there's an error
      });
  };

  useEffect(() => {
    let labelParams = '';
    if (selectedLabels.length > 0) {
      labelParams = selectedLabels.map(label => `&labels=${label.value}`).join('');
    }
    fetchProducts(currentPage, labelParams);
  }, [currentPage, selectedLabels, sortCriteria]);

  const handleSortChange = (criteria) => {
    setSortCriteria(criteria);
  };

  const handleLabelChange = (selectedOptions) => {
    setSelectedLabels(selectedOptions);
    setCurrentPage(1);
  };

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
              {sortCriteria === 'rating' ? 'Rating' : sortCriteria === 'name' ? 'Name' : sortCriteria === 'alcohol_content' ? 'Alcohol Content' : 'Sort'}
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
      ) : (
        <>
          <Row>
            {products.map(product => (
              <Col key={product.id} sm={12} md={6} lg={4} className="mb-4">
                <ProductCard product={product} userId={userId} />
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
        </>
      )}
    </Container>
  );
};

export default ProductList;
