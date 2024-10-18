import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function replaceNewLinesWithSpaces(str: string) {
  return str.replace(/\s{2,}/g, ' ').trim();
}

export function classnames(...inputs: ClassValue[]) {
  return twMerge(replaceNewLinesWithSpaces(clsx(inputs)));
}
