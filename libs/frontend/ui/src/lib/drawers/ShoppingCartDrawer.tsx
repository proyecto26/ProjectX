import { ShoppingCartIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCart } from 'react-use-cart';

import Button from '../buttons/button/Button';
import { CartItem, ShoppingCartContent } from './ShoppingCartContent';

const initialCartItems: CartItem[] = [
  {
    id: 1,
    name: 'Stylish T-Shirt',
    price: 29.99,
    quantity: 2,
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 2,
    name: 'Comfortable Jeans',
    price: 59.99,
    quantity: 1,
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: 3,
    name: 'Running Shoes',
    price: 89.99,
    quantity: 1,
    image: '/placeholder.svg?height=80&width=80',
  },
];

export function ShoppingCartDrawer() {
  const { totalItems } = useCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  return (
    <>
      <Button
        variant="ghost"
        className="btn-circle relative"
        onClick={toggleDrawer}
      >
        <ShoppingCartIcon className="h-6 w-6" />
        {totalItems > 0 && (
          <span className="badge badge-sm badge-primary absolute right-0 top-0">
            {totalItems}
          </span>
        )}
      </Button>

      {isDrawerOpen && createPortal(
        <div className="fixed right-0 top-0 z-[100] w-full max-w-md">
          <ShoppingCartContent
            key="shopping-cart-content"
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          />
        </div>,
        document.body
      )}
    </>
  );
}
