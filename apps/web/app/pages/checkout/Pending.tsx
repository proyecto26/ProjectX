import React from 'react';

export const PendingPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Pago Pendiente</h1>
      <p>Tu pago está pendiente. Te notificaremos una vez se complete.</p>
    </div>
  );
};

export default PendingPage;