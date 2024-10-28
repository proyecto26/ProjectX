import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@projectx/ui';
import { useCart } from 'react-use-cart';

const products = [
  { id: 1, name: 'Wireless Earbuds', price: 79.99, image: 'https://placehold.co/200x200?text=Earbuds' },
  { id: 2, name: 'Smart Watch', price: 199.99, image: 'https://placehold.co/200x200?text=Watch' },
  { id: 3, name: 'Laptop', price: 999.99, image: 'https://placehold.co/200x200?text=Laptop' },
  { id: 4, name: 'Smartphone', price: 699.99, image: 'https://placehold.co/200x200?text=Phone' },
  { id: 5, name: 'Bluetooth Speaker', price: 59.99, image: 'https://placehold.co/200x200?text=Speaker' },
  { id: 6, name: 'Gaming Console', price: 399.99, image: 'https://placehold.co/200x200?text=Console' },
];

export const MarketplacePage: React.FC = () => {
  const { addItem } = useCart();

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      id: String(product.id),
      name: product.name,
      price: product.price,
      currency: 'USD',
      image: product.image,
      // quantity: 1,
      // You can add more properties if needed
    });
  };
  
  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="card bg-base-100 shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <figure>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
                style={{
                  viewTransitionName: `product-${product.id}`,
                }}
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title font-semibold">${product.price.toFixed(2)}</h2>
              <p className="text-lg ">{product.name}</p>
              <div className="card-actions justify-end">
              <Button className="btn btn-sm" variant="primary" onClick={() => handleAddToCart(product)}>
                Add to Cart
              </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

