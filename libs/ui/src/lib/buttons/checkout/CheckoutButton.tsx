import React from 'react';
import { useCart } from 'react-use-cart';
import axios from 'axios';
import Button from '../button/Button';

export function CheckoutButton() {
  const { items, emptyCart } = useCart();

  const handleCheckout = async () => {
    try {
      const response = await axios.post('/api/create_preference', { items });
      const { preferenceId } = response.data;

      // Redirigir al usuario a la página de pago de MercadoPago
      window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${preferenceId}`;

      // Opcional: Vaciar el carrito después de la compra
      emptyCart();
    } catch (error) {
      console.error('Error durante el pago:', error);
      alert('Hubo un problema al procesar tu pago. Por favor, intenta nuevamente.');
    }
  };
  
  return (
    <Button onClick={handleCheckout} className="btn btn-primary">
      Proceed to Checkout
    </Button>
  );
}

export default CheckoutButton;
