'use client';

import {
  Archive,
  BookOpen,
  FileText,
  Image,
  Music2,
  Search,
  Video,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Badge } from '@/components/badge';
import { cn } from '@/lib/utils';

// ─── Data ─────────────────────────────────────────────────────────────────────

interface FormatEntry {
  name: string;
  description: string;
}

interface Category {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  formats: FormatEntry[];
}

const CATEGORIES: Category[] = [
  {
    id: 'documents',
    icon: FileText,
    title: 'Documents',
    description:
      'Word processors, spreadsheets, presentations, and portable formats.',
    color: 'text-blue-400',
    formats: [
      { name: 'PDF', description: 'Portable Document Format' },
      { name: 'DOCX', description: 'Microsoft Word Document' },
      { name: 'DOC', description: 'Legacy Word Document' },
      { name: 'TXT', description: 'Plain Text' },
      { name: 'ODT', description: 'OpenDocument Text' },
      { name: 'RTF', description: 'Rich Text Format' },
      { name: 'XLSX', description: 'Microsoft Excel Spreadsheet' },
      { name: 'XLS', description: 'Legacy Excel Spreadsheet' },
      { name: 'ODS', description: 'OpenDocument Spreadsheet' },
      { name: 'PPTX', description: 'Microsoft PowerPoint Presentation' },
      { name: 'PPT', description: 'Legacy PowerPoint Presentation' },
      { name: 'ODP', description: 'OpenDocument Presentation' },
      { name: 'CSV', description: 'Comma-Separated Values' },
      { name: 'HTML', description: 'HyperText Markup Language' },
      { name: 'MARKDOWN', description: 'Markdown Text' },
      { name: 'PAGES', description: 'Apple Pages Document' },
    ],
  },
  {
    id: 'images',
    icon: Image,
    title: 'Images',
    description:
      'Raster and vector image formats for web, print, and design.',
    color: 'text-pink-400',
    formats: [
      { name: 'PNG', description: 'Portable Network Graphics' },
      { name: 'JPG', description: 'JPEG Image' },
      { name: 'JPEG', description: 'Joint Photographic Experts Group' },
      { name: 'WebP', description: 'Web Picture Format' },
      { name: 'SVG', description: 'Scalable Vector Graphics' },
      { name: 'HEIC', description: 'High Efficiency Image Container' },
      { name: 'HEIF', description: 'High Efficiency Image Format' },
      { name: 'AVIF', description: 'AV1 Image File Format' },
      { name: 'TIFF', description: 'Tagged Image File Format' },
      { name: 'BMP', description: 'Bitmap Image' },
      { name: 'GIF', description: 'Graphics Interchange Format' },
      { name: 'ICO', description: 'Icon File' },
      { name: 'RAW', description: 'Camera Raw Image' },
      { name: 'PSD', description: 'Adobe Photoshop Document' },
      { name: 'EPS', description: 'Encapsulated PostScript' },
      { name: 'PDF', description: 'Portable Document Format (vectorized)' },
    ],
  },
  {
    id: 'audio',
    icon: Music2,
    title: 'Audio',
    description: 'Lossless and compressed audio formats for every platform.',
    color: 'text-purple-400',
    formats: [
      { name: 'MP3', description: 'MPEG Audio Layer III' },
      { name: 'WAV', description: 'Waveform Audio File' },
      { name: 'FLAC', description: 'Free Lossless Audio Codec' },
      { name: 'AAC', description: 'Advanced Audio Coding' },
      { name: 'OGG', description: 'Ogg Vorbis Audio' },
      { name: 'M4A', description: 'MPEG-4 Audio' },
      { name: 'OPUS', description: 'Opus Audio Codec' },
      { name: 'WMA', description: 'Windows Media Audio' },
      { name: 'AIFF', description: 'Audio Interchange File Format' },
      { name: 'AMR', description: 'Adaptive Multi-Rate Audio' },
      { name: 'MP2', description: 'MPEG Audio Layer II' },
      { name: 'AC3', description: 'Dolby Digital Audio' },
      { name: 'DTS', description: 'Digital Theater Systems Audio' },
      { name: 'PCM', description: 'Pulse Code Modulation' },
    ],
  },
  {
    id: 'video',
    icon: Video,
    title: 'Video',
    description:
      'All major video containers and codecs for streaming or editing.',
    color: 'text-orange-400',
    formats: [
      { name: 'MP4', description: 'MPEG-4 Video' },
      { name: 'AVI', description: 'Audio Video Interleave' },
      { name: 'MOV', description: 'Apple QuickTime Movie' },
      { name: 'MKV', description: 'Matroska Video' },
      { name: 'WebM', description: 'Web Media Format' },
      { name: 'FLV', description: 'Flash Video' },
      { name: 'WMV', description: 'Windows Media Video' },
      { name: 'M4V', description: 'iTunes Video Format' },
      { name: 'HEVC', description: 'High Efficiency Video Coding (H.265)' },
      { name: 'H264', description: 'Advanced Video Coding (H.264)' },
      { name: 'VP9', description: 'Google VP9 Codec' },
      { name: 'AV1', description: 'AOMedia Video 1' },
      { name: 'TS', description: 'MPEG Transport Stream' },
      { name: 'MPG', description: 'MPEG Video' },
      { name: 'OGV', description: 'Ogg Video' },
      { name: '3GP', description: '3GPP Mobile Video' },
    ],
  },
  {
    id: 'archives',
    icon: Archive,
    title: 'Archives',
    description:
      'Compression and archive formats for bundling and transferring files.',
    color: 'text-yellow-400',
    formats: [
      { name: 'ZIP', description: 'ZIP Archive' },
      { name: 'RAR', description: 'Roshal Archive' },
      { name: '7Z', description: '7-Zip Archive' },
      { name: 'TAR', description: 'Tape Archive' },
      { name: 'GZ', description: 'Gzip Compressed Archive' },
      { name: 'BZ2', description: 'Bzip2 Compressed Archive' },
      { name: 'XZ', description: 'XZ Compressed Archive' },
      { name: 'TAR.GZ', description: 'Gzipped Tar Archive' },
      { name: 'TAR.BZ2', description: 'Bzipped Tar Archive' },
      { name: 'TAR.XZ', description: 'XZ Compressed Tar Archive' },
      { name: 'ZSTD', description: 'Zstandard Compression' },
      { name: 'LZ4', description: 'LZ4 Fast Compression' },
    ],
  },
  {
    id: 'ebooks',
    icon: BookOpen,
    title: 'eBooks',
    description: 'Reading formats compatible with every e-reader and device.',
    color: 'text-green-400',
    formats: [
      { name: 'EPUB', description: 'Electronic Publication' },
      { name: 'EPUB3', description: 'EPUB Version 3' },
      { name: 'MOBI', description: 'Mobipocket eBook' },
      { name: 'AZW3', description: 'Amazon Kindle Format 8' },
      { name: 'AZW', description: 'Amazon Kindle Format' },
      { name: 'KFX', description: 'Kindle Format 10' },
      { name: 'FB2', description: 'FictionBook 2.0' },
      { name: 'LIT', description: 'Microsoft Reader Format' },
      { name: 'PDB', description: 'Palm Database Document' },
      { name: 'DJVU', description: 'DjVu Document Image' },
      { name: 'PDF', description: 'Portable Document Format' },
      { name: 'CBZ', description: 'Comic Book ZIP Archive' },
      { name: 'CBR', description: 'Comic Book RAR Archive' },
    ],
  },
];

const TOTAL_FORMATS = CATEGORIES.reduce((s, c) => s + c.formats.length, 0);

// ─── Component ──────────────────────────────────────────────────────────────────

export default function FormatsPage() {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CATEGORIES;
    return CATEGORIES.map((cat) => ({
      ...cat,
      formats: cat.formats.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q),
      ),
    })).filter(
      (cat) =>
        cat.formats.length > 0 || cat.title.toLowerCase().includes(q),
    );
  }, [query]);

  const totalVisible = filtered.reduce((s, c) => s + c.formats.length, 0);

  return (
    <div className="flex flex-col gap-8">
      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          placeholder={`Search ${TOTAL_FORMATS}+ formats…`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        {query && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {totalVisible} result{totalVisible !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">
            No formats found for &ldquo;{query}&rdquo;
          </p>
          <button
            type="button"
            onClick={() => setQuery('')}
            className="mt-2 text-sm text-primary hover:underline underline-offset-2"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Category sections */}
      {filtered.map((cat) => (
        <section
          key={cat.id}
          id={cat.id}
          aria-labelledby={`cat-${cat.id}`}
          className="scroll-mt-24"
        >
          <div className="mb-5 flex flex-wrap items-start gap-3">
            <div
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card',
                cat.color,
              )}
            >
              <cat.icon className="size-5" strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1">
              <h2
                id={`cat-${cat.id}`}
                className="font-semibold leading-none text-foreground"
              >
                {cat.title}
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {cat.description}
              </p>
            </div>
            <Badge
              variant="outline"
              className="shrink-0 text-xs text-muted-foreground"
            >
              {cat.formats.length} format{cat.formats.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          <div className="flex flex-wrap gap-2">
            {cat.formats.map((fmt) => (
              <Badge
                key={fmt.name}
                variant="outline"
                title={fmt.description}
                className="cursor-default font-mono text-xs transition-colors hover:border-primary/50 hover:text-primary"
              >
                {fmt.name}
              </Badge>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
