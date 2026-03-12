import { ArrowLeft, Home, Search } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

import { Button } from '@/components/button';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Moaaz Mustafa',
  description:
    'The page you are looking for could not be found. Return to the homepage or browse other sections.',
  robots: 'noindex, nofollow',
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="mx-auto max-w-2xl text-center">
        <div className="animate-fade-in-up space-y-8">
          {/* 404 Display */}
          <div className="relative">
            <div
              className="text-primary/20 text-9xl font-bold"
              role="img"
              aria-label="Error 404"
            >
              404
            </div>
            <div className="bg-primary/10 absolute inset-0 -z-10 animate-pulse rounded-full blur-3xl" />
          </div>

          {/* Title */}
          <h1 className="text-foreground text-4xl font-bold sm:text-5xl">
            Page Not Found
          </h1>

          {/* Description */}
          <div className="space-y-4">
            <p className="text-muted-foreground text-lg">
              Oops! The page you&apos;re looking for doesn&apos;t exist or has
              been moved.
            </p>
            <p className="text-muted-foreground">
              Don&apos;t worry, let&apos;s get you back on track with my
              portfolio.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/" aria-label="Return to homepage">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2"
              >
                <Home className="h-4 w-4" aria-hidden="true" />
                Go Home
              </Button>
            </Link>

            <Link href="/projects" aria-label="Browse portfolio projects">
              <Button
                variant="outline"
                size="lg"
                className="flex items-center gap-2"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Browse Projects
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <nav
            className="border-border/20 rounded-lg border p-6"
            aria-label="Quick navigation links"
          >
            <h2 className="text-foreground mb-4 text-lg font-semibold">
              Quick Links
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 rotate-180" aria-hidden="true" />
                About Me
              </Link>
              <Link
                href="/projects"
                className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 rotate-180" aria-hidden="true" />
                Projects
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 rotate-180" aria-hidden="true" />
                Contact
              </Link>
              <Link
                href="/experience"
                className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 rotate-180" aria-hidden="true" />
                Experience
              </Link>
            </div>
          </nav>

          {/* Profile Info */}
          <div className="text-center">
            <p className="text-muted-foreground text-sm">
              Moaaz Mustafa - Software Engineer & Tech Enthusiast
            </p>
            <p className="text-muted-foreground text-xs">
              Building innovative web applications and digital solutions
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
