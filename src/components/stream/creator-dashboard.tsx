"use client";

import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { LiveBadge } from "../ui/live-badge";

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
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider">{label}</label>
        {sensitive && (
          <button
            onClick={() => setHidden(!hidden)}
            className="text-[10px] text-accent hover:text-violet-400 font-bold uppercase transition"
          >
            {hidden ? "Show" : "Hide"}
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <div className="flex-1 font-mono text-xs text-secondary bg-surface px-3 py-2.5 rounded-md border border-border break-all select-all flex items-center min-h-[38px]">
          <span>{hidden ? "••••••••••••••••••••••••••••••••" : value}</span>
        </div>
        <button
          onClick={handleCopy}
          className={`h-9 px-4 rounded-md text-xs font-medium transition-colors border ${
            copied
              ? "bg-syntax-green/10 text-syntax-green border-syntax-green/30"
              : "bg-transparent text-secondary border-border hover:border-border-bright hover:text-primary"
          }`}
        >
          {copied ? "Copied" : "Copy"}
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
    <div className="space-y-10">
      {/* Creator Dashboard Header */}
      <div className="border-b border-border pb-6 flex items-end justify-between">
        <div>
          <h2 className="font-bold text-xl text-primary">Creator Dashboard</h2>
          <p className="text-sm text-secondary font-medium mt-1">Manage stream ingestion</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted font-medium">Status:</span>
          {status === "LIVE" ? (
            <LiveBadge />
          ) : status === "ENDED" ? (
            <span className="h-5 px-2 rounded-full font-mono text-[10px] bg-surface text-secondary border border-border flex items-center justify-center font-medium uppercase">
              ENDED
            </span>
          ) : (
            <span className="h-5 px-2 rounded-full font-mono text-[10px] bg-surface text-secondary border border-border flex items-center justify-center font-medium uppercase">
              OFFLINE
            </span>
          )}
        </div>
      </div>

      {/* Streaming Method Toggle */}
      <div className="space-y-4 border-b border-border pb-10">
        <label className="text-xs font-semibold text-muted uppercase tracking-wider block">
          Select Ingestion Method
        </label>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setStreamingMethod("browser")}
            className={`p-4 rounded-lg border text-left transition-colors duration-150 ${
              streamingMethod === "browser"
                ? "bg-accent/10 border-accent text-primary"
                : "bg-surface border-border text-secondary hover:border-border-bright"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Browser Streaming</span>
              <span className="text-[10px] bg-syntax-green/10 text-syntax-green px-2 py-0.5 rounded-full font-mono font-medium uppercase tracking-wider border border-syntax-green/20">
                Recommended
              </span>
            </div>
            <p className="text-xs text-secondary leading-relaxed font-medium">
              Broadcast directly from your webcam, microphone, or screen sharing without downloading additional software.
            </p>
          </button>

          <button
            onClick={() => setStreamingMethod("obs")}
            className={`p-4 rounded-lg border text-left transition-colors duration-150 ${
              streamingMethod === "obs"
                ? "bg-accent/10 border-accent text-primary"
                : "bg-surface border-border text-secondary hover:border-border-bright"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">OBS Studio</span>
              <span className="text-[10px] bg-surface text-secondary px-2 py-0.5 rounded-full font-mono font-medium uppercase tracking-wider border border-border">
                Advanced
              </span>
            </div>
            <p className="text-xs text-secondary leading-relaxed font-medium">
              Broadcast using standard desktop encoder tools (OBS, Streamlabs) to design layouts, scenes, and overlays.
            </p>
          </button>
        </div>
      </div>

      {/* Browser Streaming Content Panel */}
      {streamingMethod === "browser" && (
        <div className="space-y-6">
          <h3 className="text-base font-bold text-primary">Direct Browser Broadcast</h3>
          <BrowserBroadcaster
            streamKey={streamKey}
            ingestUrl={ingestEndpoint ? (ingestEndpoint.startsWith("rtmps://") ? ingestEndpoint : `rtmps://${ingestEndpoint}`) : "rtmps://global-contribute.live-video.net:443/app/"}
          />
        </div>
      )}

      {/* OBS Streaming Credentials Panel */}
      {streamingMethod === "obs" && (
        <div className="space-y-8">
          <div className="space-y-6 border-b border-border pb-10">
            <h3 className="text-base font-bold text-primary">RTMP Server Credentials</h3>
            
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

          {/* Structured OBS Setup Checklist */}
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-bold text-primary mb-1">OBS Studio Configuration</h3>
              <p className="text-sm text-secondary font-medium">
                Broadcast directly to CodeLive using free, open-source encoders.
              </p>
            </div>

            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Download OBS Studio",
                  desc: "Install OBS from the official website."
                },
                {
                  step: 2,
                  title: "Open Stream Settings",
                  desc: "Open OBS Studio, click on Settings in the bottom right corner, and select the Stream tab."
                },
                {
                  step: 3,
                  title: "Select Service Custom",
                  desc: "In the Service dropdown, select Custom..."
                },
                {
                  step: 4,
                  title: "Paste Ingest Server URL",
                  desc: "Copy the Ingest Server URL from the dashboard above and paste it into the Server input box."
                },
                {
                  step: 5,
                  title: "Paste Stream Key",
                  desc: "Copy the Stream Key from above and paste it into the Stream Key input box. Keep this private!"
                },
                {
                  step: 6,
                  title: "Go Live",
                  desc: "Click Start Streaming in OBS. CodeLive will detect the connection and launch the active player within seconds!"
                }
              ].map(item => (
                <div key={item.step} className="flex gap-4">
                  <div className="w-8 h-8 rounded-md bg-accent/10 border border-accent/25 flex items-center justify-center font-mono font-bold text-accent flex-shrink-0 text-sm">
                    {item.step}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-primary text-sm">{item.title}</h4>
                    <p className="text-sm text-secondary font-medium leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
