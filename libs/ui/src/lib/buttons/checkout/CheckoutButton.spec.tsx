import { render } from '@testing-library/react';

import CheckoutButton from './CheckoutButton';

describe('CheckoutButton', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CheckoutButton />);
    expect(baseElement).toBeTruthy();
  });
});
