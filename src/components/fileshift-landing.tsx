import {
  Archive,
  ArrowRight,
  BookOpen,
  ChevronRight,
  Eye,
  FileText,
  Files,
  Globe2,
  Image,
  Monitor,
  Music2,
  ShieldCheck,
  SlidersHorizontal,
  UploadCloud,
  Video,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";

// ─── Data ─────────────────────────────────────────────────────────────────────

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Globe2,
    title: "Universal Format Support",
    description:
      "With coverage across 200+ file formats, FileShift handles virtually every file type you'll encounter. From legacy document formats to modern media containers — if it's a file, we convert it.",
  },
  {
    icon: UploadCloud,
    title: "Drag & Drop Upload",
    description:
      "Simply drag your files onto the page and you're already halfway done. No manuals, no setup, no configuration — just an interface that works exactly as expected.",
  },
  {
    icon: Files,
    title: "Batch Conversion",
    description:
      "Upload an entire folder and convert everything at once. FileShift processes multiple files simultaneously so you spend less time waiting and more time working.",
  },
  {
    icon: Monitor,
    title: "No Software Installation",
    description:
      "FileShift lives entirely in your browser. No downloads, no updates, no compatibility issues — works on every modern device including laptops, tablets, and phones.",
  },
  {
    icon: Zap,
    title: "Fast Processing",
    description:
      "Powered by a distributed cloud engine, conversions complete in seconds rather than minutes. Even large files move through the pipeline at blazing speed.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Private",
    description:
      "Every file is encrypted in transit, processed in an isolated environment, and permanently deleted within one hour of download. Your data stays yours.",
  },
  {
    icon: Eye,
    title: "Preview Before Download",
    description:
      "See exactly what the converted file looks like before committing to a download. Catch quality issues or formatting surprises before they reach your workflow.",
  },
  {
    icon: SlidersHorizontal,
    title: "Custom Output Settings",
    description:
      "Fine-tune resolution, bitrate, compression level, color profile, and page size. Get precisely the output you need — not just the default.",
  },
];

const categories: {
  icon: LucideIcon;
  title: string;
  formats: string;
  description: string;
}[] = [
  {
    icon: FileText,
    title: "Documents",
    formats: "PDF · DOCX · TXT · ODT · RTF · XLSX · PPTX",
    description:
      "Convert between office documents, spreadsheets, presentations, and portable formats with full formatting fidelity.",
  },
  {
    icon: Image,
    title: "Images",
    formats: "PNG · JPG · WebP · SVG · HEIC · AVIF · TIFF",
    description:
      "Resize, reformat, and optimize images for web, print, or any platform — lossless or lossy, your choice.",
  },
  {
    icon: Music2,
    title: "Audio",
    formats: "MP3 · WAV · FLAC · AAC · OGG · M4A · OPUS",
    description:
      "Transcode audio files while preserving metadata, album art, and quality settings you control.",
  },
  {
    icon: Video,
    title: "Video",
    formats: "MP4 · AVI · MOV · MKV · WebM · FLV · HEVC",
    description:
      "Convert video to any codec or container format with fine control over resolution, frame rate, and bitrate.",
  },
  {
    icon: Archive,
    title: "Archives",
    formats: "ZIP · RAR · 7Z · TAR · GZ · BZ2 · XZ",
    description:
      "Repack or extract archives across all major compression formats without installing any native tools.",
  },
  {
    icon: BookOpen,
    title: "eBooks",
    formats: "EPUB · MOBI · AZW3 · PDF · FB2 · LIT",
    description:
      "Convert eBook files between reader formats so your library works on every device you own.",
  },
];

const steps = [
  {
    number: "01",
    title: "Upload Your File",
    description:
      "Drag and drop any file onto the converter — or click to browse. Supports files up to 2 GB.",
  },
  {
    number: "02",
    title: "Choose Output Format",
    description:
      "Select from the full list of supported formats. Adjust quality settings if you need a specific output.",
  },
  {
    number: "03",
    title: "Download Instantly",
    description:
      "Your converted file is ready in seconds. Preview it, then download directly to your device.",
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_24px_rgba(172,236,0,0.08)]">
      <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20">
        <Icon className="size-5" strokeWidth={1.75} />
      </div>
      <div className="flex flex-col gap-1.5">
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}

function CategoryCard({
  icon: Icon,
  title,
  formats,
  description,
}: {
  icon: LucideIcon;
  title: string;
  formats: string;
  description: string;
}) {
  return (
    <div className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_24px_rgba(172,236,0,0.08)]">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" strokeWidth={1.75} />
        </div>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <p className="font-mono text-xs font-medium tracking-wide text-primary/80">
        {formats}
      </p>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function FileshiftLanding() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-32 text-center"
        aria-labelledby="hero-heading"
      >
        {/* lime glow backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(172,236,0,0.13) 0%, transparent 70%)",
          }}
        />
        {/* subtle dot grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(172,236,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(172,236,0,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="relative z-10 flex max-w-4xl flex-col items-center gap-8">
          <Badge className="gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <Zap className="size-3" />
            200+ Formats · Instant · Free
          </Badge>

          <div className="flex flex-col gap-5">
            <h1
              id="hero-heading"
              className="font-(family-name:--font-orbitron) text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl"
            >
              Convert Any File.
              <br />
              <span className="text-primary">In Seconds.</span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
              FileShift is the fastest way to convert documents, images, audio,
              video, archives, and eBooks — entirely in your browser, with no
              sign-up required.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="gap-2 font-semibold">
              Start Converting Free
              <ArrowRight className="size-4" />
            </Button>
            <Button size="lg" variant="outline" className="gap-2 font-semibold">
              See All Formats
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            No account needed · Files deleted after 1 hour · Works on any device
          </p>
        </div>
      </section>

      {/* ── Core Features ─────────────────────────────────────── */}
      <section className="px-6 py-24" aria-labelledby="features-heading">
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 flex flex-col items-center gap-4 text-center">
            <Badge
              variant="outline"
              className="border-primary/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary"
            >
              Core Features
            </Badge>
            <h2
              id="features-heading"
              className="font-(family-name:--font-orbitron) text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Everything You Need.{" "}
              <span className="text-primary">Nothing You Don&apos;t.</span>
            </h2>
            <p className="max-w-2xl text-muted-foreground">
              FileShift is built around simplicity and power. Every feature is
              designed to remove friction so you can focus on the work that
              matters.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Supported Categories ──────────────────────────────── */}
      <section
        className="bg-card/50 px-6 py-24"
        aria-labelledby="formats-heading"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 flex flex-col items-center gap-4 text-center">
            <Badge
              variant="outline"
              className="border-primary/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary"
            >
              Supported Formats
            </Badge>
            <h2
              id="formats-heading"
              className="font-(family-name:--font-orbitron) text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Every Format.{" "}
              <span className="text-primary">One Tool.</span>
            </h2>
            <p className="max-w-2xl text-muted-foreground">
              From everyday office files to niche media containers, FileShift
              covers the full spectrum so you never need a second converter.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <CategoryCard key={cat.title} {...cat} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────── */}
      <section className="px-6 py-24" aria-labelledby="how-heading">
        <div className="mx-auto max-w-4xl">
          <div className="mb-14 flex flex-col items-center gap-4 text-center">
            <Badge
              variant="outline"
              className="border-primary/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary"
            >
              How It Works
            </Badge>
            <h2
              id="how-heading"
              className="font-(family-name:--font-orbitron) text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Three Steps.{" "}
              <span className="text-primary">Done.</span>
            </h2>
            <p className="max-w-2xl text-muted-foreground">
              Stripped down to the essentials. If you can drag a file, you can
              use FileShift.
            </p>
          </div>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
            {steps.flatMap((step, i) => {
              const card = (
                <div
                  key={step.number}
                  className="flex flex-1 flex-col items-center gap-4 text-center"
                >
                  <div className="flex size-14 items-center justify-center rounded-full border-2 border-primary bg-primary/10 font-(family-name:--font-orbitron) text-base font-bold text-primary">
                    {step.number}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              );

              if (i < steps.length - 1) {
                return [
                  card,
                  <div
                    key={`connector-${i}`}
                    className="hidden items-center pt-7 lg:flex"
                  >
                    <div className="h-px w-10 bg-border" />
                    <ChevronRight className="size-4 shrink-0 text-primary" />
                  </div>,
                ];
              }

              return [card];
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden px-6 py-28"
        aria-labelledby="cta-heading"
      >
        {/* glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 60% 70% at 50% 50%, rgba(172,236,0,0.10) 0%, transparent 70%)",
          }}
        />
        {/* top border line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(172,236,0,0.5), transparent)",
          }}
        />
        {/* bottom border line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(172,236,0,0.5), transparent)",
          }}
        />

        <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
          <Badge className="gap-1.5 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="size-3" />
            Free · No Sign-up · Secure
          </Badge>

          <h2
            id="cta-heading"
            className="font-(family-name:--font-orbitron) text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl"
          >
            Ready to{" "}
            <span className="text-primary">Convert?</span>
          </h2>

          <p className="text-lg leading-relaxed text-muted-foreground">
            Join thousands of users who trust FileShift daily. Start converting
            files instantly — no account, no downloads, no strings attached.
          </p>

          <Button size="lg" className="gap-2 px-8 text-base font-semibold">
            Try FileShift Free
            <ArrowRight className="size-4" />
          </Button>

          <p className="text-xs text-muted-foreground">
            Encrypted in transit · Auto-deleted within 1 hour · Zero data
            retention policy
          </p>
        </div>
      </section>
    </div>
  );
}
