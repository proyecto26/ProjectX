import type { PropsWithChildren } from 'react';
import React from 'react';
import { motion } from 'framer-motion';

import FacebookIcon from '../icons/Facebook';
import InstagramIcon from '../icons/Instagram';
import GitHubIcon from '../icons/GitHub';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import type { NavigationSection } from '../navigation';
import { classnames } from '../../utils';

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

export type LayoutProps = PropsWithChildren<{
  title?: string;
  className?: string;
  containerClassName?: string;
  isAuthenticated?: boolean;
  email?: string;
}>;

export const Layout: React.FC<LayoutProps> = ({
  children,
  title,
  className,
  containerClassName,
  isAuthenticated,
  email,
}) => {
  return (
    <motion.section className={classnames('min-h-screen flex flex-col bg-base-100 text-base-content', className)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Header
        title={title}
        sections={sections}
        logoImgSrc="/logo.svg"
        isAuthenticated={isAuthenticated}
        email={email}
      />
      <main className={
        classnames(
          "flex-grow container mx-auto px-4 py-8",
          containerClassName
        )
      }>
        {children}
      </main>
      <Footer socialLinks={socialLinks} />
    </motion.section>
  );
};

export default Layout;
