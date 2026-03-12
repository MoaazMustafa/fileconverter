import { Github, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/button';

// ─── Link data ─────────────────────────────────────────────────────────────────

const productLinks = [
  { label: 'Features', href: '/#features-heading' },
  { label: 'How It Works', href: '/#how-heading' },
  { label: 'All Formats', href: '/formats' },
  { label: 'Start Converting', href: '/convert' },
];

const formatLinks = [
  { label: 'Documents', href: '/formats#documents' },
  { label: 'Images', href: '/formats#images' },
  { label: 'Audio', href: '/formats#audio' },
  { label: 'Video', href: '/formats#video' },
  { label: 'Archives', href: '/formats#archives' },
  { label: 'eBooks', href: '/formats#ebooks' },
];

const companyLinks = [
  { label: 'About', href: '#' },
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Contact', href: '#' },
];

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com', Icon: Github },
  { label: 'Twitter / X', href: 'https://twitter.com', Icon: Twitter },
  { label: 'LinkedIn', href: 'https://linkedin.com', Icon: Linkedin },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        {/* 5-column grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Col 1: Brand */}
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="w-fit">
              <span className="font-(family-name:--font-orbitron) text-lg font-extrabold tracking-tight">
                File<span className="text-primary">Shift</span>
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              The universal file converter. Fast, secure, and entirely in your
              browser — for everyone.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Product */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Product
            </h3>
            <ul className="flex flex-col gap-2">
              {productLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Formats */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Formats
            </h3>
            <ul className="flex flex-col gap-2">
              {formatLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Company */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Company
            </h3>
            <ul className="flex flex-col gap-2">
              {companyLinks.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Stay Updated
            </h3>
            <p className="text-sm text-muted-foreground">
              Get notified about new formats and features.
            </p>
            <form className="flex flex-col gap-2" action="#" method="POST">
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                aria-label="Email address for newsletter"
                className="rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <Button type="submit" size="sm" className="w-full font-semibold">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-xs text-muted-foreground">
            © 2026 FileShift. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {companyLinks.slice(1).map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
