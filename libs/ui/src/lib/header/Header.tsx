import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts'

import { useScroll } from '../../hooks/useScroll';
import Search from '../inputs/search/Search';
import { MobileNavigation } from '../navigation/MobileNavigation';
import { NavigationSection } from '../navigation/Navigation';
import { classnames } from '../../utils';

export interface HeaderProps {
  logoImgSrc: string;
  sections: NavigationSection[];
  desktopLinks?: NavigationSection['links'];
  title?: string;
  className?: string;
  searchPlaceholder?: string;
  renderRight?: () => React.ReactNode;
}

export function Header({
  title,
  sections,
  logoImgSrc = '/logo.svg',
  searchPlaceholder = 'Search',
  desktopLinks,
  className,
  renderRight,
}: HeaderProps) {
  const { isScrolled } = useScroll();
  const [isSearchFocused, setSearchFocused] = useState(false);
  const [isMobileSearchFocused, setMobileSearchFocused] = useState(false);

  const onCloseSearch = () => {
    setSearchFocused(false);
    setMobileSearchFocused(false);
  };
  const headerRef = useRef<HTMLElement>(null)
  useOnClickOutside(headerRef, onCloseSearch);
  const openSearch = () => {
    setSearchFocused(true);
  };
  const openMobileSearch = () => {
    setMobileSearchFocused(true);
  };

  return (
    <AnimatePresence initial={false}>
      <header
        ref={headerRef}
        className={classnames(
          'sticky top-0 z-50 flex flex-wrap items-center justify-between bg-primary-contrast px-4 py-1 shadow-md shadow-slate-900/5 transition duration-500 dark:shadow-2xl sm:px-6 lg:px-8',
          className,
          isScrolled
            ? 'dark:bg-slate-900/95 dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75'
            : 'dark:bg-transparent'
        )}
      >
        <div className="flex w-full flex-wrap items-center justify-between">
          <div className="mr-6 flex lg:hidden">
            <MobileNavigation sections={sections} logoImgSrc={logoImgSrc} />
          </div>
          <div className="relative flex flex-grow items-center md:flex-[0.2_0_auto]">
            <Link
              to="/"
              aria-label="Home page"
              className="flex flex-row items-center justify-center gap-x-3 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              <img
                alt="Logo"
                src={logoImgSrc}
                className="h-9 w-auto rounded-full fill-slate-700 dark:fill-sky-100"
              />
              <h1 className="my-4 hidden text-center text-3xl font-bold text-dark-gray dark:text-dark lg:block">
                {title}
              </h1>
            </Link>
          </div>
          <div className="hidden flex-1 md:block">
            <Search placeholder={searchPlaceholder} onFocus={openSearch} onBlur={onCloseSearch} />
          </div>
          <div className="relative flex justify-end sm:gap-4 md:flex-[0.2_0_auto] md:gap-8">
            <ul className="list-reset hidden flex-1 items-center justify-end xl:flex">
              {desktopLinks?.map((link) => (
                <li className="mr-3" key={link.href}>
                  <Link
                  className="inline-block px-4 py-2 text-gray-800 no-underline dark:text-dark"
                  to={link.href}
                >
                  {link.title}
                </Link>
              </li>
              ))}
            </ul>
            {!isMobileSearchFocused && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring' }}
                onClick={openMobileSearch}
                type="button"
                className="inline-flex flex-shrink-0 items-center p-2.5 focus:outline-none md:hidden"
              >
                <MagnifyingGlassIcon
                  className="h-5 w-5 text-black dark:text-dark"
                  aria-hidden="true"
                />
                <span className="sr-only">Open Search</span>
              </motion.button>
            )}
            {renderRight && renderRight()}
          </div>
        </div>
        {isMobileSearchFocused && (
          <motion.div
            key="search"
            initial="collapsed"
            animate="open"
            className="flex flex-1 flex-row md:hidden"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.8, ease: [0.04, 0.62, 0.23, 0.98] }}
          >
            <Search
              placeholder={searchPlaceholder}
              autoFocus
              className="flex-1"
              onFocus={openMobileSearch}
              onBlur={onCloseSearch}
            />
            <button
              onClick={onCloseSearch}
              type="button"
              className="inline-flex flex-none flex-shrink-0 items-center p-2 focus:outline-none"
            >
              <XMarkIcon
                className="h-7 w-7 text-dark-gray dark:text-dark"
                aria-hidden="true"
              />
              <span className="sr-only">Close Search</span>
            </button>
          </motion.div>
        )}
      </header>
      {(isSearchFocused || isMobileSearchFocused) && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black bg-opacity-75 transition-opacity dark:bg-slate-900/95 dark:bg-opacity-40 dark:backdrop-blur dark:[@supports(backdrop-filter:blur(0))]:bg-slate-900/75"
        />
      )}
    </AnimatePresence>
  );
}

export default Header;
