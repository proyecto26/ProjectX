import { MoonIcon } from '@heroicons/react/20/solid';
import { SunIcon } from '@heroicons/react/24/outline';

export interface ThemeButtonProps {
  theme: string;
  onChange?: (theme: string) => void;
}

export function ThemeButton({ theme, onChange }: ThemeButtonProps) {
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
        className='h-10 w-10 fill-current swap-off'
        aria-hidden="true"
      />
      <MoonIcon
        className='h-10 w-10 fill-current swap-on'
        aria-hidden="true"
      />
    </label>
  );
}

export default ThemeButton;
