import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { Container, Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import './App.css';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import AddCocktail from './AddCocktail';
import Login from './Login';
import Register from './Register';
import Profile from './Profile';
import Cart from './Cart';
import Seasonal from './Seasonal';
import Shot from './Shot';

function App() {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Initialize as null
  const URL = process.env.REACT_APP_URL;

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  useEffect(() => {
    // Check if the user is logged in when the app mounts
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
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, [URL]);

  return (
    <Router>
      <div>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand as={Link} to="/">Vadim's Home Cocktail Bar</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="text-start">
                <Nav.Link as={Link} to="/">Seasonal</Nav.Link>
                <Nav.Link as={Link} to="/database">Database</Nav.Link>
                <Nav.Link as={Link} to="/longs">Long Drinks</Nav.Link>
                <Nav.Link as={Link} to="/shorts">Short Drinks</Nav.Link>
                <Nav.Link as={Link} to="/shots">Shots</Nav.Link>
              </Nav>
              <Nav className="ms-lg-auto text-start">
                <NavDropdown
                  title={selectedLanguage}
                  id="language-dropdown"
                  className="me-2"
                >
                  <NavDropdown.Item onClick={() => handleLanguageChange('English')}>
                    English
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => handleLanguageChange('Russian')}>
                    Russian
                  </NavDropdown.Item>
                </NavDropdown>
                {isLoggedIn === null ? (
                  // Show nothing or a loading indicator while checking login status
                  <></>
                ) : isLoggedIn ? (
                  <>
                    <Nav.Link as={Link} to="/add-cocktail">Add Cocktail</Nav.Link>
                    <Nav.Link as={Link} to="/cart">Cart</Nav.Link>
                    <Nav.Link as={Link} to="/profile">
                      <Button variant="outline-light" className="d-flex align-items-center">
                        <FaUserCircle className="me-1" /> Profile
                      </Button>
                    </Nav.Link>
                  </>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                  </>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container className="mt-4">
          <Routes>
            <Route path="/" element={<Seasonal />} />
            <Route path="/database" element={<ProductList />} />
            <Route path="/shots" element={<Shot />} />
            <Route path="/cocktails/:cocktail_id" element={<ProductDetail />} />
            <Route path="/add-cocktail" element={<AddCocktail />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<Register setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
