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
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/badge';
import { Button } from '@/components/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

// ─── Types ─────────────────────────────────────────────────────────────────────

type FileStatus = 'idle' | 'converting' | 'done' | 'error';

interface OutputSettings {
  quality: number;
  resolution: string;
  bitrate: string;
}

interface QueueFile {
  id: string;
  file: File;
  targetFormat: string;
  status: FileStatus;
  appliedSettings?: OutputSettings;
  errorMessage?: string;
}

interface PreviewState {
  item: QueueFile;
  objectUrl: string;
  textContent?: string;
}

// ─── Compatibility matrix ──────────────────────────────────────────────────────

// Defines which output formats are valid for each input file category.
// Cross-category allowed: video → audio extraction; ebook → PDF/TXT.
const COMPATIBLE_FORMATS: Record<string, { group: string; formats: string[] }[]> = {
  document: [
    { group: 'Document', formats: ['PDF', 'DOCX', 'DOC', 'TXT', 'ODT', 'RTF', 'HTML', 'MARKDOWN'] },
    { group: 'Spreadsheet', formats: ['XLSX', 'XLS', 'CSV', 'ODS'] },
    { group: 'Presentation', formats: ['PPTX', 'PPT', 'ODP'] },
  ],
  image: [
    { group: 'Image', formats: ['PNG', 'JPG', 'WebP', 'AVIF', 'TIFF', 'BMP', 'GIF', 'ICO'] },
  ],
  audio: [
    { group: 'Audio', formats: ['MP3', 'WAV', 'FLAC', 'AAC', 'OGG', 'M4A', 'OPUS', 'WMA', 'AIFF'] },
  ],
  video: [
    { group: 'Video', formats: ['MP4', 'AVI', 'MOV', 'MKV', 'WebM', 'FLV', 'WMV', 'M4V'] },
    { group: 'Extract Audio', formats: ['MP3', 'AAC', 'WAV', 'OGG'] },
  ],
  archive: [
    { group: 'Archive', formats: ['ZIP', 'TAR', '7Z', 'GZ', 'BZ2', 'XZ'] },
  ],
  ebook: [
    { group: 'eBook', formats: ['EPUB', 'MOBI', 'AZW3', 'FB2'] },
    { group: 'Document', formats: ['PDF', 'TXT', 'HTML'] },
  ],
};

const ALL_COMPATIBLE_FORMATS_FLAT: Record<string, string[]> = Object.fromEntries(
  Object.entries(COMPATIBLE_FORMATS).map(([cat, groups]) => [
    cat,
    groups.flatMap((g) => g.formats),
  ]),
);

// ─── Helpers ───────────────────────────────────────────────────────────────────

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
    /\.(txt|rtf|odt|docx?|xlsx?|pptx?|csv|html?|md|markdown)$/i.test(name)
  )
    return 'document';
  if (/\.(zip|rar|7z|tar|gz|bz2|xz)$/i.test(name)) return 'archive';
  if (/\.(epub|mobi|azw3?|fb2|lit|pdb)$/i.test(name)) return 'ebook';
  return 'document';
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getCategoryLabel(cat: string): string {
  const labels: Record<string, string> = {
    document: 'Document',
    image: 'Image',
    audio: 'Audio',
    video: 'Video',
    archive: 'Archive',
    ebook: 'eBook',
  };
  return labels[cat] ?? cat;
}

function isFormatCompatible(file: File, format: string): boolean {
  const cat = getFileCategory(file);
  return ALL_COMPATIBLE_FORMATS_FLAT[cat]?.includes(format) ?? false;
}

function buildDownloadBlob(file: File): Blob {
  // In a real app, this would be the server-converted output.
  // Here we return the original file bytes (same data, new extension).
  return new Blob([file], { type: file.type || 'application/octet-stream' });
}

// ─── Sub-components ────────────────────────────────────────────────────────────

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

function PreviewContent({ preview }: { preview: PreviewState }) {
  const { item, objectUrl, textContent } = preview;
  const cat = getFileCategory(item.file);

  if (cat === 'image') {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={objectUrl}
        alt={item.file.name}
        className="max-h-[60vh] w-auto rounded-md object-contain mx-auto"
      />
    );
  }
  if (cat === 'audio') {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <FileAudio className="size-16 text-purple-400" />
        <p className="text-sm font-medium text-foreground">{item.file.name}</p>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio controls src={objectUrl} className="w-full" />
      </div>
    );
  }
  if (cat === 'video') {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <video controls src={objectUrl} className="max-h-[60vh] w-full rounded-md" />
    );
  }
  if (textContent !== undefined) {
    return (
      <pre className="max-h-[60vh] overflow-auto rounded-md bg-muted p-4 text-xs leading-relaxed text-foreground whitespace-pre-wrap wrap-break-word">
        {textContent || '(empty file)'}
      </pre>
    );
  }
  // Generic fallback — metadata card
  const cat2 = getFileCategory(item.file);
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-muted/30 p-6">
      <div className="flex items-center gap-3">
        <FileIcon file={item.file} />
        <div>
          <p className="font-medium text-foreground">{item.file.name}</p>
          <p className="text-xs text-muted-foreground">{formatBytes(item.file.size)}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <span className="text-muted-foreground">Type</span>
        <span className="text-foreground">{item.file.type || 'Unknown'}</span>
        <span className="text-muted-foreground">Category</span>
        <span className="text-foreground">{getCategoryLabel(cat2)}</span>
        <span className="text-muted-foreground">Target format</span>
        <span className="font-mono text-primary">{item.targetFormat}</span>
        {item.appliedSettings && (
          <>
            <span className="text-muted-foreground">Quality</span>
            <span className="text-foreground">{item.appliedSettings.quality}%</span>
          </>
        )}
      </div>
      <p className="mt-2 rounded-md bg-primary/5 border border-primary/20 px-3 py-2 text-xs text-muted-foreground">
        Preview is not available for this file type. The converted output would be
        downloaded as <span className="font-mono text-primary">.{item.targetFormat.toLowerCase()}</span>.
      </p>
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────────

export default function ConvertDashboard() {
  const [queue, setQueue] = useState<QueueFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(true);
  const [quality, setQuality] = useState(85);
  const [resolution, setResolution] = useState('');
  const [bitrate, setBitrate] = useState('');
  const [preview, setPreview] = useState<PreviewState | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropId = useId();

  // Revoke object URL on preview close
  useEffect(() => {
    return () => {
      if (preview?.objectUrl) URL.revokeObjectURL(preview.objectUrl);
    };
  }, [preview]);

  const addFiles = useCallback((files: FileList | File[]) => {
    const items: QueueFile[] = Array.from(files).map((file) => {
      const cat = getFileCategory(file);
      const defaultFmt = ALL_COMPATIBLE_FORMATS_FLAT[cat]?.[0] ?? 'PDF';
      return {
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        targetFormat: defaultFmt,
        status: 'idle',
      };
    });
    setQueue((q) => [...q, ...items]);
    toast.info(`${items.length} file${items.length !== 1 ? 's' : ''} added to queue`);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
    },
    [addFiles],
  );

  const handleFormatChange = (id: string, fmt: string) => {
    const item = queue.find((f) => f.id === id);
    if (!item) return;
    if (!isFormatCompatible(item.file, fmt)) {
      const cat = getFileCategory(item.file);
      toast.warning(
        `Cannot convert ${getCategoryLabel(cat)} files to ${fmt}`,
        {
          description: `${getCategoryLabel(cat)} files can only be converted to: ${ALL_COMPATIBLE_FORMATS_FLAT[cat]?.join(', ')}`,
        },
      );
      return;
    }
    setQueue((q) => q.map((f) => (f.id === id ? { ...f, targetFormat: fmt } : f)));
  };

  const handleConvertAll = () => {
    const idleIds = queue.filter((f) => f.status === 'idle').map((f) => f.id);
    if (!idleIds.length) return;

    const settings: OutputSettings = { quality, resolution, bitrate };

    setQueue((q) =>
      q.map((f) =>
        idleIds.includes(f.id)
          ? { ...f, status: 'converting', appliedSettings: settings }
          : f,
      ),
    );

    toast.loading(`Converting ${idleIds.length} file${idleIds.length !== 1 ? 's' : ''}…`, {
      id: 'convert-all',
    });

    idleIds.forEach((id, i) => {
      setTimeout(() => {
        setQueue((q) => q.map((f) => (f.id === id ? { ...f, status: 'done' } : f)));
        if (i === idleIds.length - 1) {
          toast.success(`${idleIds.length} file${idleIds.length !== 1 ? 's' : ''} converted successfully`, {
            id: 'convert-all',
          });
        }
      }, 900 + i * 550);
    });
  };

  const handleDownload = (item: QueueFile) => {
    const ext = item.targetFormat.toLowerCase();
    const baseName = item.file.name.replace(/\.[^.]+$/, '');
    const blob = buildDownloadBlob(item.file);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${baseName}.${ext}`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${baseName}.${ext}`);
  };

  const handlePreview = async (item: QueueFile) => {
    const cat = getFileCategory(item.file);
    const objectUrl = URL.createObjectURL(item.file);

    if (cat === 'document' || item.file.type.startsWith('text/')) {
      try {
        const text = await item.file.text();
        setPreview({ item, objectUrl, textContent: text.slice(0, 4000) });
      } catch {
        setPreview({ item, objectUrl });
      }
    } else {
      setPreview({ item, objectUrl });
    }
  };

  const closePreview = () => {
    if (preview?.objectUrl) URL.revokeObjectURL(preview.objectUrl);
    setPreview(null);
  };

  const removeFile = (id: string) => setQueue((q) => q.filter((f) => f.id !== id));

  const hasIdle = queue.some((f) => f.status === 'idle');
  const stats: Record<FileStatus, number> = {
    idle: queue.filter((f) => f.status === 'idle').length,
    converting: queue.filter((f) => f.status === 'converting').length,
    done: queue.filter((f) => f.status === 'done').length,
    error: queue.filter((f) => f.status === 'error').length,
  };

  return (
    <>
      {/* ── Preview dialog ──────────────────────────────────── */}
      <Dialog open={preview !== null} onOpenChange={(open) => !open && closePreview()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 truncate text-sm">
              {preview && <FileIcon file={preview.item.file} />}
              <span className="truncate">{preview?.item.file.name}</span>
              {preview && (
                <Badge
                  variant="outline"
                  className="ml-auto shrink-0 font-mono text-xs text-primary"
                >
                  → {preview.item.targetFormat}
                </Badge>
              )}
            </DialogTitle>
          </DialogHeader>
          {preview && <PreviewContent preview={preview} />}
          {preview?.item.appliedSettings && (
            <div className="flex flex-wrap gap-3 border-t border-border pt-3 text-xs text-muted-foreground">
              <span>Quality: <span className="text-primary">{preview.item.appliedSettings.quality}%</span></span>
              {preview.item.appliedSettings.resolution && (
                <span>Resolution: <span className="text-foreground">{preview.item.appliedSettings.resolution}</span></span>
              )}
              {preview.item.appliedSettings.bitrate && (
                <span>Bitrate: <span className="text-foreground">{preview.item.appliedSettings.bitrate}</span></span>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* ── Left: drop zone + queue ──────────────────────── */}
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

              {queue.map((item) => {
                const cat = getFileCategory(item.file);
                const compatGroups = COMPATIBLE_FORMATS[cat] ?? [];

                return (
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
                          {item.appliedSettings && (
                            <span className="ml-2 text-primary/70">
                              · Q{item.appliedSettings.quality}%
                              {item.appliedSettings.resolution && ` · ${item.appliedSettings.resolution}`}
                              {item.appliedSettings.bitrate && ` · ${item.appliedSettings.bitrate}`}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Format selector */}
                    <Select
                      value={item.targetFormat}
                      onValueChange={(v) => handleFormatChange(item.id, v)}
                      disabled={item.status !== 'idle'}
                    >
                      <SelectTrigger
                        className="h-8 w-28 border-border bg-background text-xs"
                        aria-label={`Output format for ${item.file.name}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {compatGroups.map((group) => (
                          <SelectGroup key={group.group}>
                            <SelectLabel className="text-xs text-muted-foreground">
                              {group.group}
                            </SelectLabel>
                            {group.formats.map((fmt) => (
                              <SelectItem key={fmt} value={fmt} className="font-mono text-xs">
                                {fmt}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* Status + action icons */}
                    <div className="flex items-center gap-2">
                      <StatusBadge status={item.status} />

                      {item.status === 'done' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleDownload(item)}
                            aria-label={`Download converted ${item.file.name}`}
                            className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors hover:bg-primary/20"
                          >
                            <Download className="size-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handlePreview(item)}
                            aria-label={`Preview ${item.file.name}`}
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
                );
              })}
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

        {/* ── Right: settings + stats ──────────────────────── */}
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
                {/* Quality slider */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Quality
                    </label>
                    <span className="font-mono text-xs font-semibold text-primary">{quality}%</span>
                  </div>
                  <Slider
                    min={1}
                    max={100}
                    step={1}
                    value={[quality]}
                    onValueChange={([v]) => setQuality(v)}
                    className="w-full"
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

                <p className="rounded-md bg-muted/50 px-3 py-2 text-xs leading-relaxed text-muted-foreground">
                  Settings are applied to all files when you click{' '}
                  <span className="font-medium text-foreground">Convert All</span>.
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

          {/* Format compatibility tip */}
          <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 px-5 py-4">
            <p className="text-xs font-semibold text-primary">Format rules</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Each file only shows formats compatible with its type. Video files
              can also be converted to audio formats.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
