import React, { ComponentType, PropsWithChildren, useId } from 'react';
import { CartProvider } from 'react-use-cart';

export function withCartProvider<T extends PropsWithChildren>(
  WrappedComponent: ComponentType<T>,
): ComponentType<T> {
  return function (props: T) {
    const cartId = useId();
    return (
      <CartProvider id={cartId}>
        <WrappedComponent {...props} />
      </CartProvider>
    );
  };
}
