import type { Metadata } from 'next';

import FormatsPage from '@/components/formats-page';

export const metadata: Metadata = {
  title: 'Supported Formats — FileShift',
  description:
    'Browse all 200+ file formats supported by FileShift across documents, images, audio, video, archives, and eBooks.',
};

export default function FormatsRoute() {
  return (
    <div className="min-h-screen px-4 pb-16 pt-24 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h1 className="font-(family-name:--font-orbitron) mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Supported Formats
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            200+ formats across every major file category — all convertible
            instantly.
          </p>
        </div>
        <FormatsPage />
      </div>
    </div>
  );
}
