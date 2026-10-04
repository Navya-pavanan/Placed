'use client';
import React from 'react';
import NextLink from 'next/link';
import { useRouter as useNextRouter, usePathname, useSearchParams as useNextSearchParams } from 'next/navigation';

export const Link = ({ to, href, children, ...props }) => {
  const target = href || to || '/';
  return (
    <NextLink href={target} {...props}>
      {children}
    </NextLink>
  );
};

export const NavLink = ({ to, href, className, children, onClick, title, ...props }) => {
  const pathname = usePathname();
  const target = href || to || '/';
  const isActive = target === '/' ? pathname === '/' : pathname === target || pathname?.startsWith(target + '/');

  const computedClass = typeof className === 'function' ? className({ isActive }) : (className || '') + (isActive ? ' active' : '');

  return (
    <NextLink href={target} className={computedClass.trim()} onClick={onClick} title={title} {...props}>
      {typeof children === 'function' ? children({ isActive }) : children}
    </NextLink>
  );
};

export const useNavigate = () => {
  const router = useNextRouter();
  return (path) => {
    if (typeof path === 'number') {
      if (path === -1 && typeof window !== 'undefined') window.history.back();
      return;
    }
    router.push(path);
  };
};

export const useSearchParams = () => {
  return useNextSearchParams();
};
