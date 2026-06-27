"use client";

import { useEffect, useRef } from "react";

type Props = {
  playbackUrl: string;
  onStateChange?: (state: "LIVE" | "BUFFERING" | "CONNECTING") => void;
};

export default function IVSPlayer({
  playbackUrl,
  onStateChange,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let player: any = null;

    async function initPlayer() {
      try {
        const IVSPlayer = await import("amazon-ivs-player");

        if (!IVSPlayer.isPlayerSupported) {
          console.error("IVS Player not supported");
          return;
        }

        player = IVSPlayer.create({
          wasmWorker: "https://player.live-video.net/1.53.0/amazon-ivs-wasmworker.min.js",
          wasmBinary: "https://player.live-video.net/1.53.0/amazon-ivs-wasmworker.min.wasm"
        });

        player.attachHTMLVideoElement(videoRef.current!);

        const { PlayerState, PlayerEventType } = IVSPlayer;

        player.addEventListener(PlayerState.PLAYING, () => {
          onStateChange?.("LIVE");
        });

        player.addEventListener(PlayerState.BUFFERING, () => {
          onStateChange?.("BUFFERING");
        });

        player.addEventListener(PlayerState.READY, () => {
          onStateChange?.("CONNECTING");
        });

        player.addEventListener(PlayerEventType.ERROR, (err: any) => {
          console.error("IVS Player error:", err);
          onStateChange?.("CONNECTING");
        });

        player.load(playbackUrl);
        player.play();
      } catch (error) {
        console.error("Failed to initialize IVS Player:", error);
      }
    }

    initPlayer();

    return () => {
      if (player) {
        try {
          player.pause();
          player.delete();
        } catch (e) {
          console.error("Error destroying IVS Player:", e);
        }
      }
    };
  }, [playbackUrl, onStateChange]);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      playsInline
      className="w-full rounded-lg"
    />
  );
}