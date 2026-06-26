import { getStreamById } from "@/src/services/streams-services";
import { goLive, endStream } from "@/src/actions/stream-status-actions";

import AIAssistant from "@/src/components/ai/ai-assistant";
import StreamSummary from "@/src/components/ai/stream-summary";

import IVSPlayer from "@/src/components/stream/ivs-player";
import CopyButton from "@/src/components/stream/copy-button";
import LiveStatus from "@/src/components/stream/live-status";
import ViewTracker from "@/src/components/stream/view-tracker";
import LiveChat from "@/src/components/stream/live-chat";

export default async function StreamPage({
  params,
}: {
  params: Promise<{ streamId: string }>;
}) {
  const { streamId } = await params;

  console.log("STREAM ID:", streamId);

  const stream = await getStreamById(streamId);

  if (!stream) {
    return <div>Stream not found</div>;
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto font-sans">
      <ViewTracker streamId={stream.streamId} />
      
      {/* Auto Refreshing Live Status */}
      <LiveStatus streamId={stream.streamId} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left Column: Player & Stream Info */}
        <div className="lg:col-span-8 space-y-6">
          {/* Video Player */}
          <div className="border border-white/10 rounded-2xl p-4 bg-slate-900/40 backdrop-blur-sm overflow-hidden">
            {stream.playbackUrl ? (
              <IVSPlayer playbackUrl={stream.playbackUrl} />
            ) : (
              <div className="text-slate-400 py-12 text-center">No playback URL found</div>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-bold text-white">{stream.title}</h1>
            
            <p className="mt-2 text-sm text-gray-400 flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
              👁 {stream.viewCount ?? 0} Viewers
            </p>

            <p className="mt-4 text-slate-300 leading-relaxed">{stream.description}</p>
          </div>

          <div className="flex gap-4">
            <form action={goLive.bind(null, stream.streamId)}>
              <button className="px-5 py-2.5 rounded-xl border border-indigo-500/30 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600 hover:text-white font-medium transition duration-200 cursor-pointer">
                Go Live
              </button>
            </form>

            <form action={endStream.bind(null, stream.streamId)}>
              <button className="px-5 py-2.5 rounded-xl border border-rose-500/30 bg-rose-600/10 text-rose-400 hover:bg-rose-600 hover:text-white font-medium transition duration-200 cursor-pointer">
                End Stream
              </button>
            </form>
          </div>

          {/* Creator Controls */}
          <div className="border border-white/10 rounded-2xl p-6 bg-slate-900/40 backdrop-blur-sm">
            <h2 className="font-bold text-lg mb-4 text-white">Creator Controls</h2>

            <div className="space-y-4">
              <div>
                <p className="font-medium text-sm text-slate-300">Playback URL</p>

                <div className="flex gap-2 items-center mt-1">
                  <p className="flex-1 break-all text-xs text-slate-400 bg-black/30 p-2 rounded-lg border border-white/5">{stream.playbackUrl}</p>

                  <CopyButton text={stream.playbackUrl} />
                </div>
              </div>

              <div>
                <p className="font-medium text-sm text-slate-300">Stream Key</p>

                <div className="flex gap-2 items-center mt-1">
                  <p className="flex-1 break-all text-xs text-slate-400 bg-black/30 p-2 rounded-lg border border-white/5">{stream.streamKey}</p>

                  <CopyButton text={stream.streamKey} />
                </div>
              </div>

              <div>
                <p className="font-medium text-sm text-slate-300">Channel ARN</p>

                <div className="flex gap-2 items-center mt-1">
                  <p className="flex-1 break-all text-xs text-slate-400 bg-black/30 p-2 rounded-lg border border-white/5">{stream.channelArn}</p>

                  <CopyButton text={stream.channelArn} />
                </div>
              </div>
            </div>
          </div>

          {/* OBS Setup */}
          <div className="border border-white/10 rounded-2xl p-6 bg-slate-900/40 backdrop-blur-sm">
            <h2 className="font-bold mb-4 text-white">OBS Setup</h2>

            <p className="text-sm font-medium text-slate-300">Server</p>

            <code className="block mt-2 break-all text-xs text-indigo-400 bg-black/30 p-2.5 rounded-lg border border-white/5">
              rtmps://global-contribute.live-video.net:443/app/
            </code>

            <p className="text-sm font-medium mt-4 text-slate-300">Stream Key</p>

            <code className="block mt-2 break-all text-xs text-indigo-400 bg-black/30 p-2.5 rounded-lg border border-white/5">{stream.streamKey}</code>
          </div>

          {/* AI Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AIAssistant
              streamTitle={stream.title}
              streamDescription={stream.description}
            />

            <StreamSummary
              streamTitle={stream.title}
              streamDescription={stream.description}
            />
          </div>
        </div>

        {/* Right Column: Chat Client */}
        <div className="lg:col-span-4 lg:sticky lg:top-8 h-fit">
          <LiveChat streamId={stream.streamId} />
        </div>
      </div>
    </div>
  );
}

