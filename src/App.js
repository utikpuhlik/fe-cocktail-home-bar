import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Container, Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';  // Import the user icon from react-icons
import './App.css';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  return (
    <Router>
      <div>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="/">Vadim's Home Cocktail Bar</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">Long Drinks</Nav.Link>
                <Nav.Link href="/">Short Drinks</Nav.Link>
                <Nav.Link href="/">Shots</Nav.Link>
              </Nav>
              <Nav className="ms-auto d-flex align-items-center">
                <NavDropdown title={selectedLanguage} id="language-dropdown" className="me-2">
                  <NavDropdown.Item onClick={() => handleLanguageChange('English')}>English</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleLanguageChange('Russian')}>Russian</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="#profile">
                  <Button variant="outline-light" className="d-flex align-items-center">
                    <FaUserCircle className="me-1" /> Profile
                  </Button>
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<ProductList />} />
            <Route path="/cocktails/:cocktail_id" element={<ProductDetail />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
