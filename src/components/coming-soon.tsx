'use client';

import {
  ArrowRight,
  Calendar,
  Clock,
  Mail,
  Sparkles,
  Star,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';

interface ComingSoonProps {
  readonly title?: string;
  readonly description?: string;
  readonly expectedDate?: string;
  readonly notifyEmail?: string;
}

export default function ComingSoon({
  title = 'Coming Soon',
  description = "I'm working hard to bring you something amazing. This portfolio will showcase exciting projects and innovative solutions.",
  expectedDate = 'Q1 2025',
  notifyEmail = 'contactwithmoaaz@gmail.com',
}: ComingSoonProps) {
  return (
    <div className="bg-background min-h-screen pt-20">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          {/* Animated Icon */}
          <div className="relative mb-8">
            <div className="from-primary/20 to-primary/10 relative inline-flex rounded-full bg-linear-to-br p-6">
              <Sparkles className="text-primary h-12 w-12 animate-pulse" />
              <div className="absolute -top-2 -right-2">
                <Star className="fill-primary-400 text-primary-500 h-6 w-6 animate-bounce" />
              </div>
            </div>
          </div>

          {/* Badge */}
          <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 mb-6 transition-colors">
            <Sparkles className="mr-1 h-3 w-3" />
            Under Development
          </Badge>

          {/* Title */}
          <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {title}
          </h1>

          {/* Description */}
          <p className="text-card-foreground mx-auto mb-8 max-w-2xl text-xl leading-relaxed">
            {description}
          </p>

          {/* Timeline Info */}
          <div className="mb-12 flex flex-col items-center justify-center gap-6 sm:flex-row">
            <div className="text-muted-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5" aria-hidden="true" />
              <span className="font-medium">
                Expected Launch:{' '}
                <time dateTime={expectedDate}>{expectedDate}</time>
              </span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2">
              <Clock className="h-5 w-5" aria-hidden="true" />
              <span>Working around the clock</span>
            </div>
          </div>

          {/* Features Preview */}
          <section className="mb-12" aria-labelledby="features-heading">
            <h2 id="features-heading" className="sr-only">
              Upcoming Features
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="bg-card/30 border-border/50 rounded-lg border p-6">
                <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Star className="text-primary h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mb-2 font-semibold">Showcase Projects</h3>
                <p className="text-muted-foreground text-sm">
                  Innovative projects demonstrating technical expertise
                </p>
              </div>
              <div className="bg-card/30 border-border/50 rounded-lg border p-6">
                <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Sparkles
                    className="text-primary h-6 w-6"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="mb-2 font-semibold">Modern Design</h3>
                <p className="text-muted-foreground text-sm">
                  Beautiful, responsive interface built with latest technologies
                </p>
              </div>
              <div className="bg-card/30 border-border/50 rounded-lg border p-6">
                <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <Clock className="text-primary h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="mb-2 font-semibold">Lightning Fast</h3>
                <p className="text-muted-foreground text-sm">
                  Optimized for performance and exceptional user experience
                </p>
              </div>
            </div>
          </section>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/" aria-label="Return to homepage">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <ArrowRight className="mr-2 h-4 w-4" aria-hidden="true" />
                Back to Home
              </Button>
            </Link>
            <Link
              href={`mailto:${notifyEmail}?subject=Portfolio Launch Notification&body=Hi Moaaz! Please notify me when your portfolio is ready.`}
              aria-label="Send email notification request"
            >
              <Button
                variant="outline"
                className="border-primary/20 hover:border-primary/50 hover:bg-primary/10"
              >
                <Mail className="mr-2 h-4 w-4" aria-hidden="true" />
                Notify Me
              </Button>
            </Link>
          </div>

          {/* Footer Note */}
          <footer className="border-border/30 mt-16 border-t pt-8">
            <p className="text-muted-foreground text-sm">
              Want to stay updated?{' '}
              <Link
                href={`mailto:${notifyEmail}`}
                className="text-primary focus:ring-primary hover:underline focus:ring-2 focus:ring-offset-2 focus:outline-none"
              >
                Get in touch
              </Link>{' '}
              directly for updates and collaboration opportunities.
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}
