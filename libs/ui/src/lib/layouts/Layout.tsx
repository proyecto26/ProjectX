import type { PropsWithChildren } from 'react';
import React from 'react';
import { motion } from 'framer-motion';

import FacebookIcon from '../icons/Facebook';
import InstagramIcon from '../icons/Instagram';
import GitHubIcon from '../icons/GitHub';
import { getCookie, saveCookie } from '../../utils/cookie';
import Header from '../header/Header';
import ThemeButton from '../buttons/theme/ThemeButton';
import Footer from '../footer/Footer';
import type { NavigationSection } from '../navigation';
import { ShoppingCartDrawer } from '../drawers';

const sections: NavigationSection[] = [
  {
    title: 'Home',
    links: [
      {
        title: 'Home',
        href: '/',
      },
    ],
  },
  {
    title: 'About',
    links: [
      {
        title: 'About',
        href: '/about',
      },
    ],
  },
];

const socialLinks: NavigationSection['links'] = [
  {
    title: 'ProjectX on Facebook',
    href: 'https://www.facebook.com/proyecto26',
    icon: FacebookIcon,
  },
  {
    title: 'ProjectX on Instagram',
    href: 'https://www.instagram.com/proyecto26',
    icon: InstagramIcon,
  },
  {
    title: 'ConcertX on GitHub',
    href: 'https://www.github.com/proyecto26',
    icon: GitHubIcon,
  },
];

type LayoutProps = PropsWithChildren<{
  title?: string;
}>;

const COOKIE_NAME = 'theme';

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const [theme, setTheme] = React.useState('light');

  React.useEffect(() => {
    const theme = getCookie(COOKIE_NAME) ?? 'light';
    setTheme(theme);
  }, []);

  const onThemeChange = (newTheme: string) => {
    saveCookie(COOKIE_NAME, newTheme);
    setTheme(newTheme);
  };

  return (
    <motion.section
      className="min-h-screen flex flex-col bg-base-100 text-base-content"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header
        title={title}
        sections={sections}
        logoImgSrc="/logo.svg"
        renderRight={() => (
          <>
            <ShoppingCartDrawer />
            <ThemeButton theme={theme} onChange={onThemeChange} />
          </>
        )}
      />
      <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
      <Footer socialLinks={socialLinks} />
    </motion.section>
  );
};

export default Layout;
