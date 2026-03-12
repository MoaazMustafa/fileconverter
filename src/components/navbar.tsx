'use client';

import { ArrowRight, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';
import { Button } from './button';
import { ThemeToggle } from './theme-toggle';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Convert', href: '/convert' },
  { label: 'Formats', href: '/formats' },
  { label: 'How It Works', href: '/#how-heading' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-md border-b border-border/50 shadow-sm'
          : 'bg-transparent',
      )}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <span className="font-(family-name:--font-orbitron) text-xl font-extrabold tracking-tight">
            File<span className="text-primary">Shift</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  pathname === href
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            asChild
            size="sm"
            className="hidden gap-1.5 font-semibold md:inline-flex"
          >
            <Link href="/convert">
              Convert Now
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>

          {/* Hamburger */}
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-border/50 bg-background/95 backdrop-blur-md md:hidden">
          <ul className="flex flex-col gap-1 px-4 py-3">
            {navLinks.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'block rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    pathname === href
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                  )}
                >
                  {label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Button asChild size="sm" className="w-full gap-1.5 font-semibold">
                <Link href="/convert">
                  Convert Now
                  <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
