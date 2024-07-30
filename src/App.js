import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Container, Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';  // Import the user icon from react-icons
import './App.css';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import AddCocktail from './AddCocktail';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';

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
            <Navbar.Brand as={Link} to="/">Vadim's Home Cocktail Bar</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Long Drinks</Nav.Link>
                <Nav.Link as={Link} to="/">Short Drinks</Nav.Link>
                <Nav.Link as={Link} to="/">Shots</Nav.Link>
              </Nav>
              <Nav className="ms-auto d-flex align-items-center">
                <Nav.Link as={Link} to="/add-cocktail">Add Cocktail</Nav.Link>
                <NavDropdown title={selectedLanguage} id="language-dropdown" className="me-2">
                  <NavDropdown.Item onClick={() => handleLanguageChange('English')}>English</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleLanguageChange('Russian')}>Russian</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link as={Link} to="/profile">
                  <Button variant="outline-light" className="d-flex align-items-center">
                    <FaUserCircle className="me-1" /> Profile
                  </Button>
                </Nav.Link>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container className="mt-4">
          <Routes>
            // Routers: actually the routes that the user can navigate to in the app
            <Route path="/" element={<ProductList />} />
            <Route path="/cocktails/:cocktail_id" element={<ProductDetail />} />
            <Route path="/add-cocktail" element={<AddCocktail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
