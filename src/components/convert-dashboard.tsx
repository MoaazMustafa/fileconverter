'use client';

import {
  Archive,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Eye,
  FileAudio,
  FileText,
  FileVideo,
  Image,
  Loader2,
  Settings2,
  Trash2,
  Upload,
  UploadCloud,
  X,
} from 'lucide-react';
import { useCallback, useId, useRef, useState } from 'react';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import { cn } from '@/lib/utils';

// ─── Types ─────────────────────────────────────────────────────────────────────

type FileStatus = 'idle' | 'converting' | 'done' | 'error';

interface QueueFile {
  id: string;
  file: File;
  targetFormat: string;
  status: FileStatus;
}

// ─── Format data ───────────────────────────────────────────────────────────────

const FORMAT_OPTIONS: Record<string, string[]> = {
  document: ['PDF', 'DOCX', 'TXT', 'ODT', 'RTF', 'XLSX', 'PPTX'],
  image: ['PNG', 'JPG', 'WebP', 'SVG', 'AVIF', 'TIFF', 'BMP'],
  audio: ['MP3', 'WAV', 'FLAC', 'AAC', 'OGG', 'M4A', 'OPUS'],
  video: ['MP4', 'AVI', 'MOV', 'MKV', 'WebM', 'FLV'],
  archive: ['ZIP', 'TAR', '7Z', 'GZ'],
  ebook: ['EPUB', 'MOBI', 'PDF', 'AZW3'],
};

const ALL_FORMATS = Object.values(FORMAT_OPTIONS).flat();

function getFileCategory(file: File): string {
  const { type, name } = file;
  if (type.startsWith('image/')) return 'image';
  if (type.startsWith('audio/')) return 'audio';
  if (type.startsWith('video/')) return 'video';
  if (
    type === 'application/pdf' ||
    type.includes('word') ||
    type.includes('spreadsheet') ||
    type.includes('presentation') ||
    /\.(txt|rtf|odt|docx?|xlsx?|pptx?)$/i.test(name)
  )
    return 'document';
  if (/\.(zip|rar|7z|tar|gz|bz2)$/i.test(name)) return 'archive';
  if (/\.(epub|mobi|azw3|fb2)$/i.test(name)) return 'ebook';
  return 'document';
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Sub-components ─────────────────────────────────────────────────────────────

function FileIcon({ file }: { file: File }) {
  const cls = 'size-5 shrink-0';
  const cat = getFileCategory(file);
  if (cat === 'image') return <Image className={cn(cls, 'text-blue-400')} />;
  if (cat === 'audio') return <FileAudio className={cn(cls, 'text-purple-400')} />;
  if (cat === 'video') return <FileVideo className={cn(cls, 'text-orange-400')} />;
  if (cat === 'archive') return <Archive className={cn(cls, 'text-yellow-400')} />;
  if (cat === 'ebook') return <BookOpen className={cn(cls, 'text-green-400')} />;
  return <FileText className={cn(cls, 'text-primary')} />;
}

function StatusBadge({ status }: { status: FileStatus }) {
  if (status === 'converting')
    return (
      <Badge variant="outline" className="gap-1 border-yellow-500/30 text-yellow-500">
        <Loader2 className="size-3 animate-spin" />
        Converting
      </Badge>
    );
  if (status === 'done')
    return (
      <Badge className="gap-1 border-primary/30 bg-primary/10 text-primary">
        <Check className="size-3" />
        Done
      </Badge>
    );
  if (status === 'error')
    return <Badge variant="destructive">Error</Badge>;
  return (
    <Badge variant="outline" className="text-muted-foreground">
      Queued
    </Badge>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────

export default function ConvertDashboard() {
  const [queue, setQueue] = useState<QueueFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [quality, setQuality] = useState(85);
  const [resolution, setResolution] = useState('');
  const [bitrate, setBitrate] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const dropId = useId();

  const addFiles = useCallback((files: FileList | File[]) => {
    const items: QueueFile[] = Array.from(files).map((file) => ({
      id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
      file,
      targetFormat: FORMAT_OPTIONS[getFileCategory(file)][0] ?? 'PDF',
      status: 'idle',
    }));
    setQueue((q) => [...q, ...items]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const handleConvertAll = () => {
    const idleIds = queue.filter((f) => f.status === 'idle').map((f) => f.id);
    if (!idleIds.length) return;

    setQueue((q) =>
      q.map((f) => (idleIds.includes(f.id) ? { ...f, status: 'converting' } : f)),
    );

    idleIds.forEach((id, i) => {
      setTimeout(
        () => setQueue((q) => q.map((f) => (f.id === id ? { ...f, status: 'done' } : f))),
        900 + i * 550,
      );
    });
  };

  const removeFile = (id: string) => setQueue((q) => q.filter((f) => f.id !== id));
  const setFormat = (id: string, fmt: string) =>
    setQueue((q) => q.map((f) => (f.id === id ? { ...f, targetFormat: fmt } : f)));

  const hasIdle = queue.some((f) => f.status === 'idle');
  const stats: Record<FileStatus, number> = {
    idle: queue.filter((f) => f.status === 'idle').length,
    converting: queue.filter((f) => f.status === 'converting').length,
    done: queue.filter((f) => f.status === 'done').length,
    error: queue.filter((f) => f.status === 'error').length,
  };

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* ── Left: drop zone + queue ────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col gap-5">
        {/* Drop zone */}
        <div
          role="region"
          aria-label="File upload area"
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed px-6 py-14 text-center transition-all duration-200 select-none',
            isDragging
              ? 'scale-[1.01] border-primary bg-primary/10'
              : 'border-border bg-card hover:border-primary/50 hover:bg-primary/5',
          )}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            className="sr-only"
            aria-labelledby={dropId}
            onChange={(e) => e.target.files && addFiles(e.target.files)}
          />
          <div
            className={cn(
              'flex size-16 items-center justify-center rounded-full transition-colors',
              isDragging ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground',
            )}
          >
            <UploadCloud className="size-8" />
          </div>
          <div>
            <p id={dropId} className="font-semibold text-foreground">
              Drop files here or{' '}
              <span className="text-primary underline-offset-2 hover:underline">
                browse
              </span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              All file types supported · up to 2 GB per file
            </p>
          </div>
        </div>

        {/* File queue */}
        {queue.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">
                {queue.length} file{queue.length !== 1 ? 's' : ''} in queue
              </p>
              <button
                type="button"
                onClick={() => setQueue([])}
                className="text-xs text-muted-foreground transition-colors hover:text-destructive"
              >
                Clear all
              </button>
            </div>

            {queue.map((item) => (
              <div
                key={item.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3 sm:flex-row sm:items-center"
              >
                {/* Icon + name */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <FileIcon file={item.file} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {item.file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatBytes(item.file.size)}
                    </p>
                  </div>
                </div>

                {/* Format selector */}
                <select
                  value={item.targetFormat}
                  onChange={(e) => setFormat(item.id, e.target.value)}
                  disabled={item.status !== 'idle'}
                  aria-label={`Output format for ${item.file.name}`}
                  className="rounded-md border border-border bg-background px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                >
                  {ALL_FORMATS.map((fmt) => (
                    <option key={fmt} value={fmt}>
                      {fmt}
                    </option>
                  ))}
                </select>

                {/* Status + action icons */}
                <div className="flex items-center gap-2">
                  <StatusBadge status={item.status} />

                  {item.status === 'done' && (
                    <>
                      <button
                        type="button"
                        aria-label={`Download converted ${item.file.name}`}
                        className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors hover:bg-primary/20"
                      >
                        <Download className="size-4" />
                      </button>
                      <button
                        type="button"
                        aria-label={`Preview converted ${item.file.name}`}
                        className="flex size-7 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <Eye className="size-4" />
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={() => removeFile(item.id)}
                    aria-label={`Remove ${item.file.name}`}
                    className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-destructive"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action bar */}
        {queue.length > 0 && (
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={handleConvertAll} disabled={!hasIdle} className="gap-2 font-semibold">
              <Upload className="size-4" />
              Convert All
            </Button>
            <Button variant="outline" onClick={() => setQueue([])} className="gap-2">
              <Trash2 className="size-4" />
              Clear Queue
            </Button>
          </div>
        )}
      </div>

      {/* ── Right: settings + stats ────────────────────────── */}
      <div className="w-full shrink-0 lg:w-72">
        {/* Output settings */}
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <button
            type="button"
            onClick={() => setSettingsOpen((s) => !s)}
            className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-accent/50"
            aria-expanded={settingsOpen}
          >
            <div className="flex items-center gap-2">
              <Settings2 className="size-4 text-primary" />
              <span className="text-sm font-semibold">Output Settings</span>
            </div>
            {settingsOpen ? (
              <ChevronUp className="size-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="size-4 text-muted-foreground" />
            )}
          </button>

          {settingsOpen && (
            <div className="flex flex-col gap-5 border-t border-border px-5 py-5">
              {/* Quality */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <label
                    htmlFor="quality"
                    className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                  >
                    Quality
                  </label>
                  <span className="font-mono text-xs text-primary">{quality}%</span>
                </div>
                <input
                  id="quality"
                  type="range"
                  min={1}
                  max={100}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="h-1.5 w-full rounded-full accent-[#acec00]"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Smaller file</span>
                  <span>Best quality</span>
                </div>
              </div>

              {/* Resolution */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="resolution"
                  className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  Resolution
                </label>
                <input
                  id="resolution"
                  type="text"
                  placeholder="e.g. 1920x1080"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              {/* Bitrate */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="bitrate"
                  className="text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  Bitrate
                </label>
                <input
                  id="bitrate"
                  type="text"
                  placeholder="e.g. 192k"
                  value={bitrate}
                  onChange={(e) => setBitrate(e.target.value)}
                  className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <p className="text-xs leading-relaxed text-muted-foreground">
                Settings apply to all queued files. Leave blank to use
                defaults.
              </p>
            </div>
          )}
        </div>

        {/* Queue stats */}
        <div className="mt-4 rounded-xl border border-border bg-card px-5 py-4">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Queue Summary
          </h3>
          <div className="flex flex-col gap-1.5">
            {(
              [
                { key: 'idle', label: 'Queued', cls: 'text-foreground' },
                { key: 'converting', label: 'Converting', cls: 'text-yellow-500' },
                { key: 'done', label: 'Completed', cls: 'text-primary' },
                { key: 'error', label: 'Failed', cls: 'text-destructive' },
              ] as const
            ).map(({ key, label, cls }) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className={cn('font-mono font-medium', cls)}>{stats[key]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4">
          <p className="text-xs font-semibold text-primary">Pro tip</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            Drop an entire folder to batch-convert all files inside at once.
          </p>
        </div>
      </div>
    </div>
  );
}
