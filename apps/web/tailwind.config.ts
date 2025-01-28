// eslint-disable-next-line @nx/enforce-module-boundaries
import uiTailwindConfig from '../../libs/frontend/ui/tailwind.config.ts';
import { createGlobPatternsForDependencies } from '@nx/react/tailwind';
import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    ...createGlobPatternsForDependencies(__dirname),
  ],
  presets: [uiTailwindConfig],
} satisfies Config;
