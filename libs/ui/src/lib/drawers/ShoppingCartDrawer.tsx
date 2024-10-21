import {
  ShoppingCartIcon,
} from '@heroicons/react/24/solid';
import { useState } from 'react';
import ReactDOM from 'react-dom';
import { ClientOnly } from 'remix-utils/client-only';

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
  const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, newQuantity: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const toggleDrawer = () => {
    setIsDrawerOpen((prevState) => !prevState);
  };

  return (
    <>
      <Button variant="ghost" className="btn-circle" onClick={toggleDrawer}>
        <ShoppingCartIcon className="w-6 h-6" />
      </Button>

      <ClientOnly fallback={<div key="shopping-cart-content">Loading...</div>}>
        {() =>
          ReactDOM.createPortal(
            <div className="z-[100] fixed top-0 right-0 w-full max-w-md">
              <ShoppingCartContent
                key="shopping-cart-content"
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                cartItems={cartItems}
                removeItem={removeItem}
                updateQuantity={updateQuantity}
              />
            </div>,
            document.body
          )
        }
      </ClientOnly>
    </>
  );
}
