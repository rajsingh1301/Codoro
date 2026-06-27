"use client";

import React, { useEffect, useRef, useState } from "react";

type Props = {
  streamKey: string;
  ingestUrl: string;
};

type BroadcastState = "Idle" | "Initializing" | "Ready" | "Broadcasting" | "Stopping" | "Error";

export default function BrowserBroadcaster({ streamKey, ingestUrl }: Props) {
  const [clientLoaded, setClientLoaded] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isScreenActive, setIsScreenActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [broadcastState, setBroadcastState] = useState<BroadcastState>("Idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clientRef = useRef<any>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let active = true;
    let IVSBroadcastClientModule: any = null;

    async function initClient() {
      try {
        const module = await import("amazon-ivs-web-broadcast");
        IVSBroadcastClientModule = module.default || module;
        
        if (!active) return;

        // Create IVS Web Broadcast Client
        const client = IVSBroadcastClientModule.create({
          streamConfig: IVSBroadcastClientModule.BASIC_LANDSCAPE,
        });

        clientRef.current = client;

        // Setup event listeners
        client.on("connectionStateChange", (state: string) => {
          console.log("[Broadcast Client] Connection state change:", state);
          if (state === "connected") {
            setBroadcastState("Broadcasting");
          } else if (state === "connecting") {
            setBroadcastState("Initializing");
          } else if (state === "disconnected") {
            setBroadcastState((prev) => (prev === "Broadcasting" ? "Ready" : prev));
          }
        });

        client.on("clientError", (err: any) => {
          console.error("[Broadcast Client] Error event:", err);
          setErrorMsg(`Streaming Client Error: ${err.message || "An unexpected network error occurred."}`);
          setBroadcastState("Error");
        });

        if (canvasRef.current) {
          client.attachPreview(canvasRef.current);
        }

        setClientLoaded(true);
      } catch (err) {
        console.error("Failed to load IVS Web Broadcast Client:", err);
        setErrorMsg("Failed to initialize the broadcasting client. Please ensure your browser supports WebRTC/WebAssembly.");
        setBroadcastState("Error");
      }
    }

    initClient();

    return () => {
      active = false;
      // Clean up inputs and stop broadcast on unmount
      if (clientRef.current) {
        try {
          clientRef.current.stopBroadcast();
          clientRef.current.detachPreview();
        } catch (e) {
          console.error("Error during broadcast client cleanup:", e);
        }
      }

      // Stop camera tracks
      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      // Stop screen tracks
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Releases camera, mic, and screen tracks and resets state
  const cleanupAllStreamsAndDevices = async () => {
    if (clientRef.current) {
      try {
        if (clientRef.current.getVideoInputDevice("camera")) {
          await clientRef.current.removeVideoInputDevice("camera");
        }
        if (clientRef.current.getAudioInputDevice("mic")) {
          await clientRef.current.removeAudioInputDevice("mic");
        }
      } catch (e) {
        console.error("Error removing camera device:", e);
      }

      try {
        if (isScreenActive) {
          if (clientRef.current.getVideoInputDevice("screen")) {
            await clientRef.current.removeVideoInputDevice("screen");
          }
          if (clientRef.current.getAudioInputDevice("screen-audio")) {
            await clientRef.current.removeAudioInputDevice("screen-audio");
          }
        }
      } catch (e) {
        console.error("Error removing screen device:", e);
      }
    }

    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    setIsCameraActive(false);

    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }
    setIsScreenActive(false);
    setIsMuted(false);
  };

  // Handle camera toggle
  const handleToggleCamera = async () => {
    if (isCameraActive) {
      try {
        if (clientRef.current) {
          if (clientRef.current.getVideoInputDevice("camera")) {
            await clientRef.current.removeVideoInputDevice("camera");
          }
          if (clientRef.current.getAudioInputDevice("mic")) {
            await clientRef.current.removeAudioInputDevice("mic");
          }

          // If still broadcasting screen-only, add silent audio track back to maintain stream connection
          if (isScreenActive && broadcastState === "Broadcasting") {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
              const ctx = new AudioContextClass();
              const dest = ctx.createMediaStreamDestination();
              await clientRef.current.addAudioInputDevice(dest.stream, "mic");
            }
          }
        }
      } catch (e) {
        console.error("Error removing camera device:", e);
      }

      if (cameraStreamRef.current) {
        cameraStreamRef.current.getTracks().forEach((track) => track.stop());
        cameraStreamRef.current = null;
      }
      setIsCameraActive(false);

      if (!isScreenActive && broadcastState !== "Broadcasting") {
        setBroadcastState("Idle");
      }
    } else {
      setErrorMsg(null);
      setBroadcastState("Initializing");
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });

        cameraStreamRef.current = stream;

        // Apply mute track state if mute is active
        stream.getAudioTracks().forEach((track) => {
          track.enabled = !isMuted;
        });

        if (clientRef.current) {
          // Layer 1 for camera (overlay on top of screen share index 0)
          await clientRef.current.addVideoInputDevice(stream, "camera", { index: 1 });
          await clientRef.current.addAudioInputDevice(stream, "mic");
        }
        setIsCameraActive(true);
        setBroadcastState("Ready");
      } catch (err: any) {
        console.error("Camera access denied or failed:", err);
        setBroadcastState("Error");
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setErrorMsg("Camera or microphone permission was denied. Please allow access in browser settings.");
        } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
          setErrorMsg("No camera or microphone hardware devices were found.");
        } else {
          setErrorMsg("Failed to connect to camera or microphone. Please check connections.");
        }
      }
    }
  };

  // Handle screen share toggle
  const handleToggleScreen = async () => {
    if (isScreenActive) {
      try {
        if (clientRef.current) {
          if (clientRef.current.getVideoInputDevice("screen")) {
            await clientRef.current.removeVideoInputDevice("screen");
          }
          if (clientRef.current.getAudioInputDevice("screen-audio")) {
            await clientRef.current.removeAudioInputDevice("screen-audio");
          }
        }
      } catch (e) {
        console.error("Error removing screen device:", e);
      }

      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks().forEach((track) => track.stop());
        screenStreamRef.current = null;
      }
      setIsScreenActive(false);

      if (!isCameraActive && broadcastState !== "Broadcasting") {
        setBroadcastState("Idle");
      }
    } else {
      setErrorMsg(null);
      setBroadcastState("Initializing");
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true,
        });

        screenStreamRef.current = stream;

        if (clientRef.current) {
          // Layer 0 at bottom for screen
          await clientRef.current.addVideoInputDevice(stream, "screen", { index: 0 });
          if (stream.getAudioTracks().length > 0) {
            await clientRef.current.addAudioInputDevice(stream, "screen-audio");
          }
        }

        stream.getVideoTracks()[0].onended = () => {
          handleStopScreenShareProgrammatically();
        };

        setIsScreenActive(true);
        setBroadcastState("Ready");
      } catch (err: any) {
        console.error("Screen share failed:", err);
        setBroadcastState("Error");
        if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
          setErrorMsg("Screen sharing permission was cancelled or denied.");
        } else {
          setErrorMsg("Failed to start screen sharing.");
        }
      }
    }
  };

  const handleStopScreenShareProgrammatically = async () => {
    try {
      if (clientRef.current) {
        if (clientRef.current.getVideoInputDevice("screen")) {
          await clientRef.current.removeVideoInputDevice("screen");
        }
        if (clientRef.current.getAudioInputDevice("screen-audio")) {
          await clientRef.current.removeAudioInputDevice("screen-audio");
        }
      }
    } catch (e) {
      console.error(e);
    }
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }
    setIsScreenActive(false);
    if (!isCameraActive && broadcastState !== "Broadcasting") {
      setBroadcastState("Idle");
    }
  };

  // Mute / Unmute Microphone
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (cameraStreamRef.current) {
      cameraStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !nextMuted;
      });
    }
  };

  // Handle start/stop broadcast
  const handleToggleBroadcast = async () => {
    if (broadcastState === "Broadcasting") {
      setBroadcastState("Stopping");
      setErrorMsg(null);
      try {
        if (clientRef.current) {
          clientRef.current.stopBroadcast();
        }
        await cleanupAllStreamsAndDevices();
        setBroadcastState("Idle");
      } catch (err) {
        console.error("Failed to stop broadcast:", err);
        setErrorMsg("Failed to stop broadcasting cleanly.");
        setBroadcastState("Error");
      }
    } else {
      setErrorMsg(null);
      if (!isCameraActive && !isScreenActive) {
        setErrorMsg("Please activate at least one input source (Camera or Screen Share) before starting the stream.");
        return;
      }

      setBroadcastState("Initializing");
      try {
        if (clientRef.current) {
          // Ensure at least one audio input device is registered to satisfy IVS audio track requirements
          let hasAudio = false;
          try {
            hasAudio = !!(clientRef.current.getAudioInputDevice("mic") || clientRef.current.getAudioInputDevice("screen-audio"));
          } catch (e) {}

          if (!hasAudio) {
            console.warn("[Broadcast Client] No audio device detected. Attaching silent track to satisfy IVS ingest requirements.");
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
              const ctx = new AudioContextClass();
              const dest = ctx.createMediaStreamDestination();
              await clientRef.current.addAudioInputDevice(dest.stream, "mic");
            }
          }

          // AWS IVS Web Broadcast SDK uses client.startBroadcast(streamKey, ingestUrl)
          console.log("[Broadcast Client] Ingest URL:", ingestUrl);
          await clientRef.current.startBroadcast(streamKey, ingestUrl);
        }
        setBroadcastState("Broadcasting");
      } catch (err: any) {
        console.error("Broadcast failed to start:", err);
        setErrorMsg(`IVS connection failed: ${err.message || "Please check your network and IVS stream configurations."}`);
        setBroadcastState("Error");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Broadcast Preview Canvas */}
      <div className="relative aspect-video w-full rounded-2xl bg-black border border-white/10 overflow-hidden flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-contain"
        />
        
        {/* State Overlays */}
        {!isCameraActive && !isScreenActive && (
          <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center text-center p-6 space-y-2.5 z-10">
            <span className="text-4xl">🎥</span>
            <h4 className="text-slate-200 font-bold">No Active Inputs</h4>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Start your Camera or Share your Screen using the controllers below to set up your live scene.
            </p>
          </div>
        )}

        {broadcastState === "Initializing" && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center p-6 space-y-2 z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            <p className="text-xs text-slate-300 font-semibold tracking-wider uppercase">Connecting & Initializing...</p>
          </div>
        )}

        {broadcastState === "Stopping" && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center p-6 space-y-2 z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-500"></div>
            <p className="text-xs text-slate-300 font-semibold tracking-wider uppercase">Stopping Broadcast...</p>
          </div>
        )}

        {broadcastState === "Broadcasting" && (
          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-rose-500/90 text-white font-bold text-xs uppercase px-3 py-1.5 rounded-full shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Broadcasting Live
          </div>
        )}
      </div>

      {/* Error Messaging Bar */}
      {errorMsg && (
        <div className="p-4 rounded-xl border border-rose-500/25 bg-rose-600/10 text-rose-400 text-xs leading-relaxed font-medium">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Control Actions Panel */}
      <div className="flex flex-col space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleToggleCamera}
            disabled={broadcastState === "Broadcasting" || broadcastState === "Stopping" || broadcastState === "Initializing"}
            className={`px-4 py-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
              isCameraActive
                ? "bg-rose-600/10 border-rose-500/30 text-rose-400 hover:bg-rose-600/20"
                : "bg-slate-800/40 border-white/5 text-slate-300 hover:bg-slate-800 hover:border-white/10"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {isCameraActive ? "Stop Camera" : "Start Camera"}
          </button>

          <button
            onClick={handleToggleScreen}
            disabled={broadcastState === "Broadcasting" || broadcastState === "Stopping" || broadcastState === "Initializing"}
            className={`px-4 py-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
              isScreenActive
                ? "bg-rose-600/10 border-rose-500/30 text-rose-400 hover:bg-rose-600/20"
                : "bg-slate-800/40 border-white/5 text-slate-300 hover:bg-slate-800 hover:border-white/10"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {isScreenActive ? "Stop Screen Share" : "Start Screen Share"}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Mute/Unmute toggle (only visible/enabled when camera/mic is active) */}
          <button
            onClick={handleToggleMute}
            disabled={!isCameraActive || broadcastState === "Stopping" || broadcastState === "Initializing"}
            className={`px-4 py-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
              isMuted
                ? "bg-amber-600/10 border-amber-500/30 text-amber-400 hover:bg-amber-600/20"
                : "bg-slate-800/40 border-white/5 text-slate-300 hover:bg-slate-800 hover:border-white/10"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {isMuted ? "🎙 Unmute Mic" : "🎙 Mute Mic"}
          </button>

          <button
            onClick={handleToggleBroadcast}
            disabled={!clientLoaded || (!isCameraActive && !isScreenActive) || broadcastState === "Stopping" || broadcastState === "Initializing"}
            className={`px-4 py-3 rounded-xl text-xs font-bold transition border cursor-pointer ${
              broadcastState === "Broadcasting"
                ? "bg-rose-600 text-white border-rose-500 hover:bg-rose-700"
                : "bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-700"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {broadcastState === "Broadcasting" ? "Stop Streaming" : "Start Streaming"}
          </button>
        </div>
      </div>
    </div>
  );
}
