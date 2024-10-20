import React from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Button } from '@projectx/ui';

const products = [
  { id: 1, name: 'Wireless Earbuds', price: 79.99, image: 'https://placehold.co/200x200?text=Earbuds' },
  { id: 2, name: 'Smart Watch', price: 199.99, image: 'https://placehold.co/200x200?text=Watch' },
  { id: 3, name: 'Laptop', price: 999.99, image: 'https://placehold.co/200x200?text=Laptop' },
  { id: 4, name: 'Smartphone', price: 699.99, image: 'https://placehold.co/200x200?text=Phone' },
  { id: 5, name: 'Bluetooth Speaker', price: 59.99, image: 'https://placehold.co/200x200?text=Speaker' },
  { id: 6, name: 'Gaming Console', price: 399.99, image: 'https://placehold.co/200x200?text=Console' },
];

export const MarketplacePage: React.FC = () => {
  return (
    <div className="container mx-auto px-4">
      <motion.div 
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold">Marketplace</h1>
        <div className="flex items-center">
          <div className="relative mr-4">
            <input
              type="text"
              placeholder="Search products"
              className="input input-bordered w-full max-w-xs pr-10"
            />
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <Button variant="ghost" className="btn-circle">
            <ShoppingCartIcon className="h-6 w-6" />
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="card bg-base-100 shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <figure><img src={product.image} alt={product.name} className="w-full h-48 object-cover" /></figure>
            <div className="card-body">
              <h2 className="card-title">{product.name}</h2>
              <p className="text-lg font-semibold">${product.price.toFixed(2)}</p>
              <div className="card-actions justify-end">
                <Button variant="primary">Add to Cart</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

