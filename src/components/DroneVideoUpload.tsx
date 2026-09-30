import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Video, Upload, X, Play, AlertTriangle,
  CheckCircle2, Loader2, MapPin, Info, Film
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, AIDisclaimer } from './ui';

// ─── Types ────────────────────────────────────────────────────
interface VideoInfo {
  file: File;
  objectUrl: string;
  duration: number | null;
  name: string;
  type: string;
  sizeMB: number;
}

interface SimulatedResult {
  zonesDetected: number;
  highPriority: number;
  potentialMaterial: number;
  materials: { label: string; pct: number }[];
}

type AnalysisState = 'idle' | 'processing' | 'done';

const PROCESSING_STEPS = [
  'Analyzing drone survey…',
  'Processing frames…',
  'Identifying potential debris areas…',
];

const MAX_SIZE_MB = 500;

const ACCEPTED_TYPES: Record<string, boolean> = {
  'video/mp4': true,
  'video/quicktime': true,
  'video/webm': true,
  'video/x-msvideo': true,
  'video/avi': true,
};

const SIMULATED_RESULT: SimulatedResult = {
  zonesDetected: 6,
  highPriority: 2,
  potentialMaterial: 4,
  materials: [
    { label: 'Concrete', pct: 61 },
    { label: 'Steel', pct: 21 },
    { label: 'Timber', pct: 11 },
    { label: 'Other', pct: 7 },
  ],
};

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function formatSize(bytes: number): string {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

// ─── Component ────────────────────────────────────────────────
export default function DroneVideoUpload() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [processingStep, setProcessingStep] = useState(0);
  const [result, setResult] = useState<SimulatedResult | null>(null);

  // Cleanup object URL on unmount or video change
  useEffect(() => {
    return () => {
      if (videoInfo?.objectUrl) {
        URL.revokeObjectURL(videoInfo.objectUrl);
      }
    };
  }, [videoInfo?.objectUrl]);

  const validateAndLoad = useCallback((file: File) => {
    setError(null);

    // Type validation
    const isVideoMime = ACCEPTED_TYPES[file.type] || file.type.startsWith('video/');
    if (!isVideoMime) {
      // Also check by extension as fallback
      const ext = file.name.split('.').pop()?.toLowerCase();
      const validExts = ['mp4', 'mov', 'webm', 'avi'];
      if (!ext || !validExts.includes(ext)) {
        setError('Unsupported file type. Please upload a video file (.mp4, .mov, .webm, .avi).');
        return;
      }
    }

    // Size validation
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > MAX_SIZE_MB) {
      setError(`Video file is too large. Maximum supported size is ${MAX_SIZE_MB} MB.`);
      return;
    }

    // Revoke previous URL
    if (videoInfo?.objectUrl) {
      URL.revokeObjectURL(videoInfo.objectUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setVideoInfo({
      file,
      objectUrl,
      duration: null,
      name: file.name,
      type: file.type || `video/${file.name.split('.').pop()}`,
      sizeMB,
    });
    setAnalysisState('idle');
    setResult(null);
  }, [videoInfo]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndLoad(file);
    // Reset input value so same file can be re-selected
    e.target.value = '';
  };

  const handleVideoLoaded = () => {
    if (videoRef.current && videoInfo) {
      const dur = videoRef.current.duration;
      setVideoInfo(prev => prev ? { ...prev, duration: isFinite(dur) ? dur : null } : null);
    }
  };

  const handleRemove = () => {
    if (videoInfo?.objectUrl) {
      URL.revokeObjectURL(videoInfo.objectUrl);
    }
    setVideoInfo(null);
    setError(null);
    setAnalysisState('idle');
    setResult(null);
    setProcessingStep(0);
  };

  const handleAnalyze = async () => {
    setAnalysisState('processing');
    setResult(null);

    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      setProcessingStep(i);
      await new Promise(r => setTimeout(r, 1100));
    }

    setResult(SIMULATED_RESULT);
    setAnalysisState('done');
  };

  // Drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndLoad(file);
  };

  const friendlyType = (raw: string) => {
    if (raw.includes('mp4')) return 'MP4 Video';
    if (raw.includes('quicktime') || raw.includes('mov')) return 'MOV Video';
    if (raw.includes('webm')) return 'WebM Video';
    if (raw.includes('avi') || raw.includes('msvideo')) return 'AVI Video';
    return 'Video File';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Film className="w-4 h-4 text-orange-400" />
        <h3 className="text-sm font-bold text-slate-100">Drone Survey Video</h3>
        <span className="text-xs px-2 py-0.5 bg-orange-500/15 text-orange-400 border border-orange-500/30 rounded font-semibold">
          AERIAL SURVEY
        </span>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2.5 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-300 flex-shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {!videoInfo ? (
        /* ── EMPTY STATE / DROP ZONE ───────────────────────── */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer
            transition-all duration-200 group
            ${isDragging
              ? 'border-orange-400/60 bg-orange-500/8'
              : 'border-slate-600/50 hover:border-orange-400/40 hover:bg-orange-500/5 bg-slate-800/20'
            }
          `}
        >
          <div className={`p-4 rounded-full border transition-colors ${isDragging ? 'bg-orange-500/15 border-orange-500/30' : 'bg-slate-700/30 border-slate-600/40 group-hover:border-orange-500/30 group-hover:bg-orange-500/10'}`}>
            <Video className={`w-8 h-8 transition-colors ${isDragging ? 'text-orange-400' : 'text-slate-500 group-hover:text-orange-400'}`} />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-slate-300 mb-1">Upload Drone Survey</p>
            <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
              Upload aerial footage to inspect disaster-affected areas and identify potential debris locations.
            </p>
            <p className="text-xs text-slate-600 mt-2">MP4 · MOV · WebM · AVI · Max {MAX_SIZE_MB} MB</p>
          </div>
          <Button
            variant="warning"
            size="sm"
            icon={<Upload className="w-3.5 h-3.5" />}
            onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
          >
            + Add Drone Video
          </Button>
          {isDragging && (
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-orange-500/5">
              <p className="text-sm font-semibold text-orange-400">Drop video file here</p>
            </div>
          )}
        </div>
      ) : (
        /* ── VIDEO LOADED STATE ────────────────────────────── */
        <div className="space-y-3">
          {/* Video player */}
          <div className="relative bg-black rounded-xl overflow-hidden border border-slate-700/40">
            <video
              ref={videoRef}
              src={videoInfo.objectUrl}
              controls
              onLoadedMetadata={handleVideoLoaded}
              className="w-full max-h-72 object-contain"
              style={{ aspectRatio: '16/9' }}
            >
              Your browser does not support the video tag.
            </video>
          </div>

          {/* File info */}
          <Card className="p-3">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-orange-500/15 rounded-lg">
                  <Film className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">Drone Survey Video</p>
                  <p className="text-xs text-slate-400 font-mono truncate max-w-[200px]">{videoInfo.name}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                analysisState === 'done'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : analysisState === 'processing'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
              }`}>
                {analysisState === 'done' ? '✓ Analysis Complete' : analysisState === 'processing' ? 'Analyzing…' : 'Ready for Analysis'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {[
                { label: 'File Type', value: friendlyType(videoInfo.type) },
                { label: 'File Size', value: formatSize(videoInfo.file.size) },
                ...(videoInfo.duration !== null ? [{ label: 'Duration', value: formatDuration(videoInfo.duration) }] : []),
                { label: 'Upload Status', value: 'Loaded — local preview' },
              ].map(r => (
                <div key={r.label} className="flex justify-between py-1 border-b border-slate-700/20 last:border-0">
                  <span className="text-slate-500">{r.label}</span>
                  <span className="text-slate-300 font-medium">{r.value}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Action buttons */}
          {analysisState !== 'processing' && (
            <div className="flex gap-2 flex-wrap">
              {analysisState !== 'done' && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Play className="w-3.5 h-3.5" />}
                  onClick={handleAnalyze}
                >
                  Analyze Video
                </Button>
              )}
              {analysisState === 'done' && (
                <Button
                  variant="success"
                  size="sm"
                  icon={<Play className="w-3.5 h-3.5" />}
                  onClick={handleAnalyze}
                >
                  Re-Analyze
                </Button>
              )}
              <Button
                variant="danger"
                size="sm"
                icon={<X className="w-3.5 h-3.5" />}
                onClick={handleRemove}
              >
                Remove Video
              </Button>
            </div>
          )}

          {/* Processing state */}
          {analysisState === 'processing' && (
            <Card className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                <span className="text-sm font-semibold text-slate-200">Processing drone survey…</span>
              </div>
              <div className="space-y-1.5">
                {PROCESSING_STEPS.map((step, i) => (
                  <div key={step} className={`flex items-center gap-2 text-xs transition-colors ${
                    i < processingStep ? 'text-emerald-400' :
                    i === processingStep ? 'text-blue-300' : 'text-slate-600'
                  }`}>
                    {i < processingStep ? (
                      <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                    ) : i === processingStep ? (
                      <Loader2 className="w-3 h-3 animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-3 h-3 rounded-full border border-slate-700 flex-shrink-0" />
                    )}
                    {step}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Analysis result */}
          {analysisState === 'done' && result && (
            <AnalysisResult result={result} onViewMap={() => navigate('/map')} />
          )}
        </div>
      )}

      {/* Always-visible disclaimer */}
      {!videoInfo && (
        <p className="text-xs text-slate-600 flex items-start gap-1.5">
          <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
          Video is processed locally in your browser. No data is transmitted to any server.
        </p>
      )}
    </div>
  );
}

// ─── Analysis Result Panel ────────────────────────────────────
function AnalysisResult({ result, onViewMap }: { result: SimulatedResult; onViewMap: () => void }) {
  return (
    <Card className="p-4 border-blue-500/25 bg-[#0b1f40]">
      {/* Simulated label */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-700/40">
        <div className="px-2 py-0.5 bg-blue-500/15 border border-blue-500/30 rounded text-xs font-bold text-blue-300 uppercase tracking-wide">
          SIMULATED AI ANALYSIS
        </div>
        <span className="text-xs text-slate-600 italic">— demo prototype</span>
      </div>

      {/* Zone counts */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: 'Zones Detected', value: result.zonesDetected, color: 'text-slate-100' },
          { label: 'High Priority', value: result.highPriority, color: 'text-red-400' },
          { label: 'Material Zones', value: result.potentialMaterial, color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="text-center p-2.5 bg-slate-800/40 rounded-lg">
            <div className={`text-xl font-bold font-mono ${s.color}`}>{s.value}</div>
            <div className="text-xs text-slate-500 mt-0.5 leading-tight">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Material indicators */}
      <div className="mb-4">
        <p className="text-xs font-semibold text-slate-400 mb-2">Material Indicators</p>
        <div className="space-y-2">
          {result.materials.map(m => (
            <div key={m.label}>
              <div className="flex justify-between mb-0.5">
                <span className="text-xs text-slate-300">{m.label}</span>
                <span className="text-xs font-mono text-slate-400">{m.pct}%</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-blue-500"
                  style={{ width: `${m.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safety message */}
      <div className="p-2.5 bg-amber-500/8 border border-amber-500/20 rounded-lg mb-3">
        <p className="text-xs text-amber-400/90">
          AI-assisted visual analysis — field verification required.
        </p>
        <p className="text-xs text-slate-600 mt-0.5">
          Never use AI analysis as a substitute for professional structural assessment.
          Field verification required before any action.
        </p>
      </div>

      <AIDisclaimer compact />

      {/* Navigate to map */}
      <div className="mt-3">
        <Button
          variant="primary"
          size="sm"
          icon={<MapPin className="w-3.5 h-3.5" />}
          onClick={onViewMap}
          className="w-full justify-center"
        >
          View Detected Zones on Map
        </Button>
      </div>
    </Card>
  );
}
