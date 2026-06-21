"use client";

import { useEffect, useRef } from "react";

type Props = {
  playbackUrl: string;
};

export default function IVSPlayer({
  playbackUrl,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    async function initPlayer() {
      const IVSPlayer = await import(
        "amazon-ivs-player"
      );

      if (!IVSPlayer.isPlayerSupported) {
        console.error(
          "IVS Player not supported"
        );
        return;
      }

      const player = IVSPlayer.create({
        wasmWorker: "https://player.live-video.net/1.53.0/amazon-ivs-wasmworker.min.js",
        wasmBinary: "https://player.live-video.net/1.53.0/amazon-ivs-wasmworker.min.wasm"
      });

      player.attachHTMLVideoElement(
        videoRef.current!
      );

      player.load(playbackUrl);

      player.play();
    }

    initPlayer();
  }, [playbackUrl]);

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