import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleProducts, setVisibleProducts] = useState(6);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    size: '',
    color: '',
    brand: ''
  });
  const [sortBy, setSortBy] = useState('');
  const observer = useRef();

  useEffect(() => {
    axios.get('https://fakestoreapi.com/products')
      .then(response => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const filteredProducts = products.filter(product =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filters.size ? product.size === filters.size : true) &&
    (filters.color ? product.color === filters.color : true) &&
    (filters.brand ? product.brand === filters.brand : true)
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'priceLowToHigh') {
      return a.price - b.price;
    } else if (sortBy === 'priceHighToLow') {
      return b.price - a.price;
    } else {
      return 0;
    }
  });

  const loadMore = () => {
    setVisibleProducts(prevVisibleProducts => prevVisibleProducts + 6);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const lastProductRef = useRef();

  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    });
    if (lastProductRef.current) observer.current.observe(lastProductRef.current);
  }, [loading, visibleProducts]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading products.</p>;

  return (
    <div>
      {/* Search bar */}
      <div className="mt-3">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="mt-3">
        <select value={filters.size} onChange={e => handleFilterChange('size', e.target.value)}>
          <option value="">Select Size</option>
          {/* Add size options here */}
        </select>
        {/* Add filters for color, brand, etc. */}
      </div>

      {/* Sort */}
      <div className="mt-3">
        <select value={sortBy} onChange={handleSortChange}>
          <option value="">Sort By</option>
          <option value="priceLowToHigh">Price: Low to High</option>
          <option value="priceHighToLow">Price: High to Low</option>
        </select>
      </div>

      {/* Product list */}
      <div className="row">
        {sortedProducts.slice(0, visibleProducts).map((product, index) => {
          if (sortedProducts.length === index + 1) {
            return (
              <div className="col-md-4 product-card" key={product.id} ref={lastProductRef}>
                <div className="card mb-4">
                  <div className="product-image-container">
                    <img className="card-img-top product-image" src={product.image} alt={product.title} />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title product-title">{product.title}</h5>
                    <p className="card-text product-price">${product.price}</p>
                    <Link to={`/products/${product.id}`} className="btn btn-primary">View Details</Link>
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div className="col-md-4 product-card" key={product.id}>
                <div className="card mb-4">
                  <div className="product-image-container">
                    <img className="card-img-top product-image" src={product.image} alt={product.title} />
                  </div>
                  <div className="card-body">
                    <h5 className="card-title product-title">{product.title}</h5>
                    <p className="card-text product-price">${product.price}</p>
                    <Link to={`/products/${product.id}`} className="btn btn-primary">View Details</Link>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
      
      {/* Load more button */}
      {visibleProducts < sortedProducts.length && (
        <div className="text-center">
          <button className="btn btn-primary" onClick={loadMore}>Load More</button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
