import { ComponentProps } from 'react';

export type ButtonProps = ComponentProps<'button'>;

export function Button({ children }: ButtonProps) {
  return (
    <button className="bg-primary text-white p-2 rounded-md">
      {children}
    </button>
  );
}

export default Button;
