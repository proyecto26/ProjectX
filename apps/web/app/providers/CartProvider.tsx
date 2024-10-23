import React, { PropsWithChildren } from 'react';
import { CartProvider as UseShoppingCartProvider } from 'react-use-cart';

type CartProviderProps = PropsWithChildren;

export function CartProvider({ children }: CartProviderProps) {
  return (
    <UseShoppingCartProvider
      id="cart"
    >
      {children}
    </UseShoppingCartProvider>
  );
}

export default CartProvider;