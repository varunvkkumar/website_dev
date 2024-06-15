import React from 'react';

function Product({ product }) {
  const addToCart = () => {
    console.log(`Added ${product.name} to cart`);
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <p>Price: ${product.price}</p>
      <button onClick={addToCart}>Add to Cart</button>
    </div>
  );
}

export default Product;
