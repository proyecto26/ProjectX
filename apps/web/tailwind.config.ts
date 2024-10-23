// eslint-disable-next-line @nx/enforce-module-boundaries
import uiTailwindConfig from '../../libs/ui/tailwind.config.ts';
import { createGlobPatternsForDependencies } from '@nx/react/tailwind';
import type { Config } from 'tailwindcss';

const content = [
  './app/**/*.{js,jsx,ts,tsx}',
  ...createGlobPatternsForDependencies(__dirname),
];

export default {
  content,
  presets: [uiTailwindConfig],
} satisfies Config;
