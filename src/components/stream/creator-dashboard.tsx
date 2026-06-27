"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

const BrowserBroadcaster = dynamic(() => import("./browser-broadcaster"), { ssr: false });

type Props = {
  streamId: string;
  playbackUrl: string;
  streamKey: string;
  channelArn: string;
  ingestEndpoint: string;
};

// Custom interactive copy button with success feedback
function CopyField({ label, value, sensitive = false }: { label: string; value: string; sensitive?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [hidden, setHidden] = useState(sensitive);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</label>
        {sensitive && (
          <button
            onClick={() => setHidden(!hidden)}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold uppercase transition"
          >
            {hidden ? "👁 Show" : "🙈 Hide"}
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <div className="flex-1 font-mono text-xs text-slate-300 bg-black/45 px-3 py-2.5 rounded-xl border border-white/5 break-all select-all flex items-center justify-between min-h-[38px]">
          <span>{hidden ? "••••••••••••••••••••••••••••••••" : value}</span>
        </div>
        <button
          onClick={handleCopy}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition duration-200 border cursor-pointer ${
            copied
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
              : "bg-indigo-600/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-600 hover:text-white"
          }`}
        >
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

export default function CreatorDashboard({
  streamId,
  playbackUrl,
  streamKey,
  channelArn,
  ingestEndpoint,
}: Props) {
  const [status, setStatus] = useState<"OFFLINE" | "LIVE" | "ENDED">("OFFLINE");
  const [streamingMethod, setStreamingMethod] = useState<"browser" | "obs">("browser");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let active = true;

    async function checkStatus() {
      try {
        const res = await fetch(`/api/stream-status/${streamId}`);
        if (res.ok) {
          const data = await res.json();
          if (active) {
            setStatus(data.status);
          }
        }
      } catch (err) {
        console.error("Dashboard status fetch failed:", err);
      }
    }

    checkStatus();
    // Poll status to let the creator see ingest state live
    intervalRef.current = setInterval(checkStatus, 4000);

    return () => {
      active = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [streamId]);

  return (
    <div className="space-y-8">
      {/* Creator Dashboard Header & Selector */}
      <div className="border border-white/10 rounded-2xl p-6 bg-slate-900/40 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
          <h2 className="font-bold text-lg text-white">Creator Dashboard</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Ingest status:</span>
            {status === "LIVE" ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/25">
                ● LIVE
              </span>
            ) : status === "ENDED" ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/25">
                ENDED
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-white/5">
                OFFLINE
              </span>
            )}
          </div>
        </div>

        {/* Streaming Method Toggle */}
        <div className="mb-6 space-y-2.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Select Ingestion Method
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setStreamingMethod("browser")}
              className={`p-4 rounded-xl border text-left transition duration-200 cursor-pointer ${
                streamingMethod === "browser"
                  ? "bg-indigo-600/10 border-indigo-500 text-white"
                  : "bg-slate-800/20 border-white/5 text-slate-400 hover:border-white/10"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold">Browser Streaming</span>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-emerald-500/10">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Broadcast directly from your webcam, microphone, or screen sharing without downloading additional software.
              </p>
            </button>

            <button
              onClick={() => setStreamingMethod("obs")}
              className={`p-4 rounded-xl border text-left transition duration-200 cursor-pointer ${
                streamingMethod === "obs"
                  ? "bg-indigo-600/10 border-indigo-500 text-white"
                  : "bg-slate-800/20 border-white/5 text-slate-400 hover:border-white/10"
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-bold">OBS Studio</span>
                <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Advanced
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Broadcast using standard desktop encoder tools (OBS, Streamlabs) to design layouts, scenes, and overlays.
              </p>
            </button>
          </div>
        </div>

        {/* Browser Streaming Content Panel */}
        {streamingMethod === "browser" && (
          <div className="border-t border-white/5 pt-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-200 mb-1">Direct Browser Broadcast</h3>
            <BrowserBroadcaster
              streamKey={streamKey}
              ingestUrl={ingestEndpoint ? (ingestEndpoint.startsWith("rtmps://") ? ingestEndpoint : `rtmps://${ingestEndpoint}`) : "rtmps://global-contribute.live-video.net:443/app/"}
            />
          </div>
        )}

        {/* OBS Streaming Credentials Panel */}
        {streamingMethod === "obs" && (
          <div className="border-t border-white/5 pt-6 space-y-5">
            <h3 className="text-sm font-bold text-slate-200 mb-1">RTMP Server Credentials</h3>
            
            <CopyField
              label="RTMP Ingest Server URL"
              value="rtmps://global-contribute.live-video.net:443/app/"
            />

            <CopyField
              label="Stream Key"
              value={streamKey}
              sensitive={true}
            />

            <CopyField
              label="Playback HLS URL"
              value={playbackUrl}
            />

            <CopyField
              label="IVS Channel ARN"
              value={channelArn}
            />
          </div>
        )}
      </div>

      {/* Structured OBS Setup Checklist (Only displayed under OBS tab) */}
      {streamingMethod === "obs" && (
        <div className="border border-white/10 rounded-2xl p-6 bg-slate-900/40 backdrop-blur-sm">
          <h2 className="font-bold text-lg mb-4 text-white">OBS Studio Configuration Guide</h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Broadcast directly to CodeLive using free, open-source encoders like OBS Studio.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center font-bold text-indigo-400 flex-shrink-0 text-sm">
                1
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-sm mb-0.5">Download OBS Studio</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  If you do not have it, install OBS from the{" "}
                  <a
                    href="https://obsproject.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-indigo-400 hover:underline"
                  >
                    official website
                  </a>.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center font-bold text-indigo-400 flex-shrink-0 text-sm">
                2
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-sm mb-0.5">Open Stream Settings</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Open OBS Studio, click on <strong>Settings</strong> in the bottom right corner, and select the <strong>Stream</strong> tab.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center font-bold text-indigo-400 flex-shrink-0 text-sm">
                3
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-sm mb-0.5">Select Service Custom</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  In the "Service" dropdown selection, select <strong>Custom...</strong>.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center font-bold text-indigo-400 flex-shrink-0 text-sm">
                4
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-sm mb-0.5">Paste Ingest Server URL</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Copy the Ingest Server URL from the dashboard above and paste it into the <strong>Server</strong> input box.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center font-bold text-indigo-400 flex-shrink-0 text-sm">
                5
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-sm mb-0.5">Paste Stream Key</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Copy the Stream Key from above and paste it into the <strong>Stream Key</strong> input box. Keep this private!
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center font-bold text-indigo-400 flex-shrink-0 text-sm">
                6
              </div>
              <div>
                <h4 className="font-semibold text-slate-200 text-sm mb-0.5">Go Live</h4>
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  Click <strong>Start Streaming</strong> in OBS. CodeLive will detect the connection and launch the active player within seconds!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
