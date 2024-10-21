import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';
import { useId } from 'react';

import { classnames } from '../../utils';
import Button from '../buttons/button/Button';

export type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type ShoppingCartContentProps = {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
};

export function ShoppingCartContent({
  isOpen,
  onClose,
  cartItems,
  removeItem,
  updateQuantity,
}: ShoppingCartContentProps) {
  const inputId = useId();
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 10;
  const total = subtotal + shipping;

  return (
    <div
      className={classnames('drawer drawer-end', isOpen ? 'drawer-open' : '')}
    >
      <input
        id={inputId}
        type="checkbox"
        className="drawer-toggle"
        checked={isOpen}
        readOnly
      />
      <div className="drawer-side">
        <label htmlFor={inputId} className="drawer-overlay" onClick={onClose} />
        <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Shopping Cart</h2>
            <Button
              variant="ghost"
              className="btn-circle"
              onClick={onClose}
              aria-label="Close shopping cart"
            >
              <XMarkIcon className="w-6 h-6" />
            </Button>
          </div>
          <div className="flex flex-col h-full">
            <div className="flex-grow overflow-y-auto">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="card card-compact bg-base-100 shadow-xl mb-4"
                  >
                    <figure className="px-4 pt-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="rounded-xl"
                      />
                    </figure>
                    <div className="card-body">
                      <h3 className="card-title text-sm">{item.name}</h3>
                      <p className="text-base-content text-opacity-60">
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <button
                            className="btn btn-xs btn-outline"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            aria-label={`Decrease quantity of ${item.name}`}
                          >
                            <MinusIcon className="w-3 h-3" />
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            className="btn btn-xs btn-outline"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            aria-label={`Increase quantity of ${item.name}`}
                          >
                            <PlusIcon className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <TrashIcon className="w-4 h-4 text-error" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {cartItems.length === 0 && (
                <div className="alert alert-info">
                  <span>Your cart is empty</span>
                </div>
              )}
            </div>
            <div className="mt-auto">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-4">
                  <h3 className="card-title text-lg">Summary</h3>
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="divider my-2"></div>
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="card-actions justify-end mt-4">
                    <button className="btn btn-primary btn-block">
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
