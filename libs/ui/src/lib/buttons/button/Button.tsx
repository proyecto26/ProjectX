import { ComponentProps } from 'react';

export type ButtonProps = ComponentProps<'button'>;

export function Button({ children }: ButtonProps) {
  return (
    <button className="btn">
      {children}
    </button>
  );
}

export default Button;
