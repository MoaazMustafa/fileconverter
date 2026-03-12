import type { Metadata } from 'next';

import ConvertDashboard from '@/components/convert-dashboard';

export const metadata: Metadata = {
  title: 'Convert Files — FileShift',
  description:
    'Upload any file and convert it to your desired format instantly. Supports 200+ formats. Free, no sign-up required.',
};

export default function ConvertPage() {
  return (
    <div className="min-h-screen px-4 pb-16 pt-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h1 className="font-(family-name:--font-orbitron) mb-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Convert Your Files
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Upload one or more files, pick an output format, and download in
            seconds.
          </p>
        </div>
        <ConvertDashboard />
      </div>
    </div>
  );
}
