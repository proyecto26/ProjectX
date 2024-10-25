import { MoonIcon } from '@heroicons/react/20/solid';
import { SunIcon } from '@heroicons/react/24/outline';

import { classnames } from '../../../utils';

export interface ThemeButtonProps {
  theme: string;
  className?: string;
  onChange?: (theme: string) => void;
}

export function ThemeButton({ theme, onChange, className }: ThemeButtonProps) {
  const toggleTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    const newTheme = isChecked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    onChange?.(newTheme);
  };

  return (
    <label className="swap swap-rotate">
      <input
        type="checkbox"
        onChange={toggleTheme}
        className="theme-controller sr-only"
        checked={theme === 'dark'}
      />

      <SunIcon
        className={classnames('h-10 w-10 fill-current swap-off', className)}
        aria-hidden="true"
      />
      <MoonIcon
        className={classnames('h-10 w-10 fill-current swap-on', className)}
        aria-hidden="true"
      />
    </label>
  );
}

export default ThemeButton;
