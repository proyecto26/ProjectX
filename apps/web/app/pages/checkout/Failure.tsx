import React from 'react';

export const FailurePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Pago Fallido</h1>
      <p>Hubo un problema con tu pago. Por favor, intenta nuevamente.</p>
    </div>
  );
};

export default FailurePage;