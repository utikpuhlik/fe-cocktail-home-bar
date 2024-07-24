import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Container, Navbar, Nav } from 'react-bootstrap';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';


function App() {
  return (
    <Router>
      <div>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand href="/">My Store</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
            </Nav>
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
