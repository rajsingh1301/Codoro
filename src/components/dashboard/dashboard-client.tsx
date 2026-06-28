"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { 
  LayoutDashboard, 
  Video, 
  Users, 
  Settings, 
  Radio, 
  Eye, 
  Plus, 
  ChevronRight, 
  Calendar, 
  User, 
  Activity, 
  Globe, 
  Tv, 
  ArrowUpRight,
  Sparkles,
  Key,
  Copy,
  Check,
  EyeOff,
  Trash2
} from "lucide-react";
import AIAssistant from "../ai/ai-assistant";
import { deleteStreamAction } from "@/src/actions/stream-actions";

type Stream = {
  streamId: string;
  title: string;
  description?: string;
  creatorName: string;
  creatorImage?: string;
  status: string;
  viewCount?: number;
  createdAt: string;
  communityId?: string;
  streamKey?: string;
  playbackUrl?: string;
  creatorId?: string;
};

type Community = {
  communityId: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  ownerImage?: string;
  createdAt: string;
};

type Props = {
  user: {
    id: string;
    username: string;
    imageUrl: string;
  };
  streams: Stream[];
  communities: Community[];
};

function formatISOToDate(isoString: string, includeYear = true) {
  try {
    const parts = isoString.split("T")[0].split("-");
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (includeYear) {
      return `${months[monthIndex]} ${day}, ${year}`;
    }
    return `${months[monthIndex]} ${day}`;
  } catch (e) {
    return isoString;
  }
}

// Client Card to render revealable Stream Key configurations
function StreamKeyCard({ stream }: { stream: Stream }) {
  const [showKey, setShowKey] = useState(false);
  const [copiedServer, setCopiedServer] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  // Mock global IVS contribution endpoint if none exists
  const serverUrl = "rtmps://global-contribute.live-video.net:443/app/";
  const streamKeyVal = stream.streamKey || "sk_us-east-1_xxxxx_xxxxxxxxxx";

  const handleCopyServer = () => {
    navigator.clipboard.writeText(serverUrl);
    setCopiedServer(true);
    setTimeout(() => setCopiedServer(false), 2000);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(streamKeyVal);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="bg-[#171717] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 space-y-5 shadow-sm transition-all hover:border-[rgba(255,255,255,0.12)]">
      <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-3">
        <h4 className="font-bold text-sm text-white">{stream.title}</h4>
        <span className="text-[9px] font-mono text-[#5C5C5C] uppercase tracking-wider font-semibold border border-[rgba(255,255,255,0.08)] px-1.5 py-0.5 rounded bg-[#111111]">
          RTMP Ingest
        </span>
      </div>

      <div className="space-y-4">
        {/* Server Endpoint URL */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-[#9E9E9E] uppercase tracking-wider block">Server Ingest URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={serverUrl}
              className="flex-grow h-9 px-3 bg-[#111111] border border-[rgba(255,255,255,0.08)] rounded-lg text-xs font-mono text-[#9E9E9E] outline-none"
            />
            <button
              onClick={handleCopyServer}
              className="h-9 px-3 inline-flex items-center justify-center rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] text-[#9E9E9E] hover:text-white transition-all cursor-pointer text-xs"
            >
              {copiedServer ? <Check size={14} className="text-[#4ADE80]" /> : <Copy size={14} />}
            </button>
          </div>
        </div>

        {/* Secret Key */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-semibold text-[#9E9E9E] uppercase tracking-wider block">Stream Key</label>
          <div className="flex gap-2">
            <input
              type={showKey ? "text" : "password"}
              readOnly
              value={streamKeyVal}
              className="flex-grow h-9 px-3 bg-[#111111] border border-[rgba(255,255,255,0.08)] rounded-lg text-xs font-mono text-white outline-none select-none"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="h-9 px-3 inline-flex items-center justify-center rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] text-[#9E9E9E] hover:text-white transition-all cursor-pointer text-xs"
              title={showKey ? "Hide Stream Key" : "Reveal Stream Key"}
            >
              {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
            <button
              onClick={handleCopyKey}
              className="h-9 px-3 inline-flex items-center justify-center rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] text-[#9E9E9E] hover:text-white transition-all cursor-pointer text-xs"
            >
              {copiedKey ? <Check size={14} className="text-[#4ADE80]" /> : <Copy size={14} />}
            </button>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-[#5C5C5C] leading-normal font-medium">
        Warning: Keep your stream key private. Anyone with access to this key can hijack your broadcast stream room.
      </p>
    </div>
  );
}

export default function DashboardClient({ user, streams, communities }: Props) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "streams" | "communities" | "ai-assistant" | "settings" | "stream-keys">("dashboard");

  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [localStreams, setLocalStreams] = useState<Stream[]>(streams);

  useEffect(() => {
    setLocalStreams(streams);
  }, [streams]);

  const handleDeleteStream = async (streamId: string) => {
    const confirmed = window.confirm("Are you sure? This stream and all its data will be permanently deleted.");
    if (!confirmed) return;

    try {
      await deleteStreamAction(streamId);
      setLocalStreams(prev => prev.filter(s => s.streamId !== streamId));
      alert("Stream deleted successfully!");
    } catch (err: any) {
      console.error("FAILED TO DELETE STREAM:", err);
      alert(`Failed to delete stream: ${err.message || err}`);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Form states for settings
  const [profileName, setProfileName] = useState(user.username);
  const [streamDescription, setStreamDescription] = useState("Live coding and building software projects in public.");
  const [defaultCategory, setDefaultCategory] = useState("TypeScript");

  // Sync profileName with Clerk data once loaded
  useEffect(() => {
    if (clerkLoaded && clerkUser) {
      setProfileName(clerkUser.fullName || clerkUser.username || "");
    }
  }, [clerkLoaded, clerkUser]);

  // Load custom default stream settings from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedDesc = localStorage.getItem("codelive_default_description");
      if (savedDesc) setStreamDescription(savedDesc);

      const savedCat = localStorage.getItem("codelive_default_category");
      if (savedCat) setDefaultCategory(savedCat);
    }
  }, []);

  const handleSaveChanges = async () => {
    if (!clerkUser) {
      alert("You must be logged in to update your profile.");
      return;
    }

    setIsSaving(true);
    try {
      const nameParts = profileName.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      await clerkUser.update({
        firstName,
        lastName,
      });

      if (typeof window !== "undefined") {
        localStorage.setItem("codelive_default_description", streamDescription);
        localStorage.setItem("codelive_default_category", defaultCategory);
      }

      alert("Settings saved successfully!");
    } catch (err: any) {
      console.error("Failed to update profile settings:", err);
      alert(`Failed to save settings: ${err.errors?.[0]?.longMessage || err.message || err}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Format current date
  const currentDateString = useMemo(() => {
    if (!mounted) return "";
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [mounted]);

  // Compute metrics
  const totalStreamsCount = localStreams.length;
  const communitiesCount = communities.length;
  
  const latestStream = localStreams[0] || null;
  const isLive = localStreams.some((s) => s.status === "LIVE");
  
  const currentStreamStatus = useMemo(() => {
    if (isLive) return "LIVE";
    if (latestStream && latestStream.status === "CONNECTING") return "CONNECTING";
    return "OFFLINE";
  }, [isLive, latestStream]);

  const totalViewCount = useMemo(() => {
    return localStreams.reduce((sum, s) => sum + (s.viewCount || 0), 0);
  }, [localStreams]);

  const handleTabChange = (tab: "dashboard" | "streams" | "communities" | "ai-assistant" | "settings" | "stream-keys") => {
    setActiveTab(tab);
  };

  // Render Sidebar (Icon-only, 56px wide fixed sidebar)
  const renderSidebar = () => {
    const creatorItems = [
      { id: "dashboard", label: "Overview", icon: <LayoutDashboard size={18} /> },
      { id: "streams", label: "My streams", icon: <Video size={18} /> },
      { id: "communities", label: "My communities", icon: <Users size={18} /> },
      { id: "ai-assistant", label: "AI assistant", icon: <Sparkles size={18} /> },
    ];

    const accountItems = [
      { id: "settings", label: "Settings", icon: <Settings size={18} /> },
      { id: "stream-keys", label: "Stream keys", icon: <Key size={18} /> },
    ];

    return (
      <aside className="fixed left-0 top-16 w-14 flex-shrink-0 border-r border-[rgba(255,255,255,0.08)] bg-[#111111] z-20 h-[calc(100vh-64px)] hidden md:block">
        <div className="flex flex-col h-full py-6">
          <nav className="flex-1 space-y-6">
            
            {/* CREATOR SECTION */}
            <div className="space-y-1 px-2">
              {creatorItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id as any)}
                    className={`flex items-center justify-center w-full h-10 rounded-lg transition-all duration-200 cursor-pointer relative ${
                      isActive
                        ? "bg-[#171717] text-white border-l-2 border-[#6366F1]"
                        : "text-[#9E9E9E] hover:text-white hover:bg-[#171717]/60"
                    }`}
                    title={item.label}
                  >
                    {item.icon}
                  </button>
                );
              })}
            </div>

            <div className="border-t border-[rgba(255,255,255,0.08)] mx-2" />

            {/* ACCOUNT SECTION */}
            <div className="space-y-1 px-2">
              {accountItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id as any)}
                    className={`flex items-center justify-center w-full h-10 rounded-lg transition-all duration-200 cursor-pointer relative ${
                      isActive
                        ? "bg-[#171717] text-white border-l-2 border-[#6366F1]"
                        : "text-[#9E9E9E] hover:text-white hover:bg-[#171717]/60"
                    }`}
                    title={item.label}
                  >
                    {item.icon}
                  </button>
                );
              })}
            </div>

          </nav>
        </div>
      </aside>
    );
  };

  return (
    <div className="w-full flex bg-transparent z-10 relative min-h-[calc(100vh-64px)]">
      {/* Sidebar Navigation */}
      {renderSidebar()}

      {/* Dynamic Main Dashboard Pane */}
      <main className="flex-grow md:ml-14 px-6 lg:px-12 py-10 w-full mx-auto relative z-10">
        
        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === "dashboard" && (
          <div className="space-y-10 animate-in fade-in duration-300">
            
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-[rgba(255,255,255,0.08)] pb-8">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-[#9E9E9E] tracking-wider uppercase">Welcome back to CodeLive</p>
                <h1 className="text-3xl font-bold text-white tracking-tight">
                  Good Evening, {user.username} 👋
                </h1>
                <p className="text-sm text-[#9E9E9E]">
                  Manage your live coding sessions, communities, and AI tools.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {latestStream ? (
                  <>
                    <Link
                      href={`/streams/${latestStream.streamId}`}
                      className="h-10 px-5 inline-flex items-center justify-center rounded-lg bg-[#6366F1] hover:bg-[#5053E4] text-white font-medium text-sm transition-all shadow-sm cursor-pointer hover:-translate-y-0.5"
                    >
                      <Radio size={16} className="mr-2" /> Start Stream
                    </Link>
                    <Link
                      href={`/streams/${latestStream.streamId}`}
                      className="h-10 px-5 inline-flex items-center justify-center rounded-lg bg-[#171717] border border-[rgba(255,255,255,0.08)] text-[#9E9E9E] hover:text-white hover:border-[rgba(255,255,255,0.16)] font-medium text-sm transition-all cursor-pointer hover:-translate-y-0.5"
                    >
                      <Settings size={16} className="mr-2" /> Configure
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/communities"
                    className="h-10 px-5 inline-flex items-center justify-center rounded-lg bg-[#6366F1] hover:bg-[#5053E4] text-white font-medium text-sm transition-all shadow-sm cursor-pointer hover:-translate-y-0.5"
                  >
                    <Plus size={16} className="mr-2" /> Create Stream
                  </Link>
                )}
                <button
                  onClick={() => handleTabChange("settings")}
                  className="h-10 px-5 inline-flex items-center justify-center rounded-lg bg-[#171717] border border-[rgba(255,255,255,0.08)] text-[#9E9E9E] hover:text-white hover:border-[rgba(255,255,255,0.16)] font-medium text-sm transition-all cursor-pointer hover:-translate-y-0.5"
                >
                  <User size={16} className="mr-2" /> Profile
                </button>
              </div>
            </div>

            {/* Overview Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Metric 1 */}
              <div className="flex flex-col justify-between p-5 bg-[#171717] border border-[rgba(255,255,255,0.08)] rounded-2xl h-[120px] shadow-sm hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex justify-between items-center text-[#9E9E9E]">
                  <span className="text-xs font-semibold uppercase tracking-wider">Live Status</span>
                  <Radio size={16} className={currentStreamStatus === "LIVE" ? "text-red-500" : "text-[#9E9E9E]"} />
                </div>
                <div>
                  <span className="text-2xl font-bold text-white tracking-tight">{currentStreamStatus}</span>
                  <p className="text-[10px] text-[#5C5C5C] mt-1 font-medium">Ingest status indicator</p>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="flex flex-col justify-between p-5 bg-[#171717] border border-[rgba(255,255,255,0.08)] rounded-2xl h-[120px] shadow-sm hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex justify-between items-center text-[#9E9E9E]">
                  <span className="text-xs font-semibold uppercase tracking-wider">Current Viewers</span>
                  <Eye size={16} />
                </div>
                <div>
                  <span className="text-2xl font-bold text-white tracking-tight">{totalViewCount}</span>
                  <p className="text-[10px] text-[#5C5C5C] mt-1 font-medium">Real-time audience size</p>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="flex flex-col justify-between p-5 bg-[#171717] border border-[rgba(255,255,255,0.08)] rounded-2xl h-[120px] shadow-sm hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex justify-between items-center text-[#9E9E9E]">
                  <span className="text-xs font-semibold uppercase tracking-wider">Total Streams</span>
                  <Video size={16} />
                </div>
                <div>
                  <span className="text-2xl font-bold text-white tracking-tight">{totalStreamsCount}</span>
                  <p className="text-[10px] text-[#5C5C5C] mt-1 font-medium">Completed video broadcasts</p>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="flex flex-col justify-between p-5 bg-[#171717] border border-[rgba(255,255,255,0.08)] rounded-2xl h-[120px] shadow-sm hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex justify-between items-center text-[#9E9E9E]">
                  <span className="text-xs font-semibold uppercase tracking-wider">Communities</span>
                  <Users size={16} />
                </div>
                <div>
                  <span className="text-2xl font-bold text-white tracking-tight">{communitiesCount}</span>
                  <p className="text-[10px] text-[#5C5C5C] mt-1 font-medium">Streaming circles joined</p>
                </div>
              </div>
            </div>

            {/* Dashboard Sub-Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT SIDE: Streams and Communities */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* Recent Streams section */}
                <div className="bg-[#171717] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-4 mb-4">
                    <h3 className="text-base font-semibold text-white">Recent Streams</h3>
                    <button onClick={() => handleTabChange("streams")} className="text-xs text-[#6366F1] hover:underline font-medium flex items-center">
                      View All <ChevronRight size={14} />
                    </button>
                  </div>

                  {localStreams.length > 0 ? (
                    <div className="divide-y divide-[rgba(255,255,255,0.08)]">
                      {localStreams.slice(0, 5).map((stream) => {
                        const isStreamLive = stream.status === "LIVE";
                        return (
                          <div key={stream.streamId} className="py-4 flex items-center justify-between group transition-all">
                            <div className="flex items-center gap-4">
                              <div className={`h-2.5 w-2.5 rounded-full ${isStreamLive ? 'bg-red-500 animate-pulse' : 'bg-[#5C5C5C]'}`} />
                              <div className="flex flex-col">
                                <h4 className="font-semibold text-sm text-white group-hover:text-[#6366F1] transition-colors">{stream.title}</h4>
                                <div className="flex items-center gap-3 text-xs text-[#9E9E9E] mt-1 font-medium">
                                  <span className="flex items-center gap-1">
                                    <Calendar size={12} /> {formatISOToDate(stream.createdAt, true)}
                                  </span>
                                  {stream.communityId && (
                                    <span className="px-2 py-0.5 rounded bg-[#111111] text-xs border border-[rgba(255,255,255,0.08)] font-mono text-[#6366F1]">
                                      Group
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Link
                                href={`/streams/${stream.streamId}`}
                                className="text-xs font-semibold text-[#9E9E9E] hover:text-white bg-[#111111] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] px-3 py-1.5 rounded-lg transition-all"
                              >
                                Configure
                              </Link>
                              <Link
                                href={`/streams/${stream.streamId}`}
                                className="text-xs font-semibold text-white bg-[#6366F1] hover:bg-[#5053E4] px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                              >
                                View <ArrowUpRight size={12} />
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                      <div className="p-3 bg-[#111111] rounded-2xl border border-[rgba(255,255,255,0.08)]">
                        <Video size={24} className="text-[#5C5C5C]" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-white">No streams found</p>
                        <p className="text-xs text-[#9E9E9E]">Create a new stream and share your screen in real time.</p>
                      </div>
                      <Link
                        href="/communities"
                        className="h-9 px-4 inline-flex items-center justify-center rounded-lg bg-[#6366F1] hover:bg-[#5053E4] text-white font-medium text-xs transition-colors"
                      >
                        Create Your First Stream
                      </Link>
                    </div>
                  )}
                </div>

                {/* Communities list section */}
                <div className="bg-[#171717] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-4 mb-4">
                    <h3 className="text-base font-semibold text-white">My Communities</h3>
                    <button onClick={() => handleTabChange("communities")} className="text-xs text-[#6366F1] hover:underline font-medium flex items-center">
                      View All <ChevronRight size={14} />
                    </button>
                  </div>

                  {communities.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {communities.slice(0, 4).map((community) => (
                        <div key={community.communityId} className="p-4 bg-[#111111] border border-[rgba(255,255,255,0.08)] rounded-xl flex flex-col justify-between gap-4 group hover:border-[rgba(255,255,255,0.16)] transition-all">
                          <div className="space-y-2">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-[#171717] flex items-center justify-center border border-[rgba(255,255,255,0.08)] text-[#6366F1] font-semibold text-sm uppercase">
                                {community.name.substring(0, 2)}
                              </div>
                              <h4 className="font-semibold text-sm text-white group-hover:text-[#6366F1] transition-colors">{community.name}</h4>
                            </div>
                            <p className="text-xs text-[#9E9E9E] line-clamp-2 leading-relaxed">
                              {community.description || "No description provided."}
                            </p>
                          </div>
                          
                          <div className="flex justify-between items-center pt-2 border-t border-[rgba(255,255,255,0.08)]">
                            <span className="text-[10px] text-[#5C5C5C] uppercase tracking-wider font-semibold">142 Members</span>
                            <Link
                              href={`/communities/${community.communityId}`}
                              className="text-xs font-semibold text-[#9E9E9E] hover:text-white bg-[#171717] border border-[rgba(255,255,255,0.08)] px-2.5 py-1.5 rounded-lg transition-all flex items-center"
                            >
                              Open <ChevronRight size={12} className="ml-1" />
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                      <div className="p-3 bg-[#111111] rounded-2xl border border-[rgba(255,255,255,0.08)]">
                        <Users size={24} className="text-[#5C5C5C]" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-white">No communities found</p>
                        <p className="text-xs text-[#9E9E9E]">Build circles with other developers to broadcast together.</p>
                      </div>
                      <Link
                        href="/communities/create"
                        className="h-9 px-4 inline-flex items-center justify-center rounded-lg bg-[#6366F1] hover:bg-[#5053E4] text-white font-medium text-xs transition-colors"
                      >
                        Create Community
                      </Link>
                    </div>
                  )}
                </div>

              </div>

              {/* RIGHT SIDE: Activity feed and Quick shortcuts */}
              <div className="lg:col-span-4 space-y-8">
                
                {/* Quick Actions Panel */}
                <div className="bg-[#171717] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 shadow-sm space-y-4">
                  <h3 className="text-xs font-semibold uppercase text-[#9E9E9E] tracking-wider">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/communities"
                      className="flex items-center gap-2.5 p-3 bg-[#111111] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] rounded-xl group transition-all cursor-pointer"
                    >
                      <Plus size={16} className="text-[#6366F1]" />
                      <span className="text-xs font-semibold text-[#9E9E9E] group-hover:text-white transition-colors">New Stream</span>
                    </Link>
                    <Link
                      href="/communities"
                      className="flex items-center gap-2.5 p-3 bg-[#111111] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] rounded-xl group transition-all cursor-pointer"
                    >
                      <Users size={16} className="text-[#6366F1]" />
                      <span className="text-xs font-semibold text-[#9E9E9E] group-hover:text-white transition-colors">Circles</span>
                    </Link>
                    <button
                      onClick={() => handleTabChange("settings")}
                      className="flex items-center gap-2.5 p-3 bg-[#111111] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] rounded-xl group transition-all cursor-pointer text-left"
                    >
                      <User size={16} className="text-[#6366F1]" />
                      <span className="text-xs font-semibold text-[#9E9E9E] group-hover:text-white transition-colors">Profile</span>
                    </button>
                    {latestStream && (
                      <Link
                        href={`/streams/${latestStream.streamId}`}
                        className="flex items-center gap-2.5 p-3 bg-[#111111] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] rounded-xl group transition-all cursor-pointer"
                      >
                        <Globe size={16} className="text-[#6366F1]" />
                        <span className="text-xs font-semibold text-[#9E9E9E] group-hover:text-white transition-colors">Webcast</span>
                      </Link>
                    )}
                    {latestStream && (
                      <Link
                        href={`/streams/${latestStream.streamId}`}
                        className="flex items-center gap-2.5 p-3 bg-[#111111] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] rounded-xl group transition-all cursor-pointer"
                      >
                        <Tv size={16} className="text-[#6366F1]" />
                        <span className="text-xs font-semibold text-[#9E9E9E] group-hover:text-white transition-colors">OBS Encoder</span>
                      </Link>
                    )}
                    <button
                      onClick={() => handleTabChange("ai-assistant")}
                      className="flex items-center gap-2.5 p-3 bg-[#111111] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] rounded-xl group transition-all cursor-pointer text-left w-full"
                    >
                      <Sparkles size={16} className="text-[#6366F1]" />
                      <span className="text-xs font-semibold text-[#9E9E9E] group-hover:text-white transition-colors">Assistant</span>
                    </button>
                  </div>
                </div>

                {/* Activity Feed Panel */}
                <div className="bg-[#171717] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 shadow-sm space-y-5">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-[#6366F1]" />
                    <h3 className="text-xs font-semibold uppercase text-[#9E9E9E] tracking-wider">Activity Feed</h3>
                  </div>

                  <div className="relative border-l border-[rgba(255,255,255,0.08)] pl-4 ml-1.5 space-y-6">
                    <div className="relative">
                      <div className="absolute -left-[21px] top-1.5 bg-[#6366F1] h-2.5 w-2.5 rounded-full" />
                      <p className="text-xs font-semibold text-white">Joined Developer Community</p>
                      <p className="text-[10px] text-[#9E9E9E] mt-0.5">Joined the Next.js streaming circle • Just now</p>
                    </div>

                    {latestStream && (
                      <div className="relative">
                        <div className="absolute -left-[21px] top-1.5 bg-[#6366F1]/55 h-2.5 w-2.5 rounded-full" />
                        <p className="text-xs font-semibold text-white">Created Stream Room</p>
                        <p className="text-[10px] text-[#9E9E9E] mt-0.5">Created session "{latestStream.title}" • 2 hours ago</p>
                      </div>
                    )}

                    <div className="relative">
                      <div className="absolute -left-[21px] top-1.5 bg-[#6366F1]/30 h-2.5 w-2.5 rounded-full" />
                      <p className="text-xs font-semibold text-white">AI Assistant Session</p>
                      <p className="text-[10px] text-[#9E9E9E] mt-0.5">Prompted coding helper for syntax analysis • 1 day ago</p>
                    </div>

                    <div className="relative">
                      <div className="absolute -left-[21px] top-1.5 bg-[#6366F1]/30 h-2.5 w-2.5 rounded-full" />
                      <p className="text-xs font-semibold text-white">Viewer Activity</p>
                      <p className="text-[10px] text-[#9E9E9E] mt-0.5">New developer subscribed to your workspace • 3 days ago</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 2: MY STREAMS LIST */}
        {activeTab === "streams" && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
            <div className="border-b border-[rgba(255,255,255,0.08)] pb-6 space-y-2">
              <h2 className="text-3xl font-bold text-white tracking-tight">Streams</h2>
              <p className="text-sm text-[#9E9E9E] font-medium">Manage broadcast history and credentials</p>
            </div>

            {localStreams.length > 0 ? (
              <div className="bg-[#171717] border border-[rgba(255,255,255,0.08)] rounded-2xl overflow-hidden shadow-sm divide-y divide-[rgba(255,255,255,0.08)]">
                {localStreams.map((stream) => (
                  <div key={stream.streamId} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-[#111111]/30 transition-all">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold text-base text-white group-hover:text-[#6366F1] transition-all">{stream.title}</h4>
                        {stream.status === "LIVE" ? (
                          <span className="text-[9px] font-mono text-red-500 border border-red-950 bg-red-950/20 px-2 py-0.5 rounded-md uppercase font-semibold">LIVE</span>
                        ) : (
                          <span className="text-[9px] font-mono text-[#9E9E9E] border border-[rgba(255,255,255,0.08)] px-2 py-0.5 rounded-md uppercase font-semibold">OFFLINE</span>
                        )}
                      </div>
                      <p className="text-sm text-[#9E9E9E] line-clamp-1 leading-relaxed">{stream.description || "No description provided."}</p>
                      <span className="text-xs text-[#5C5C5C] block font-medium">{formatISOToDate(stream.createdAt, true)}</span>
                    </div>
                    <div className="flex items-center gap-3 self-start md:self-center shrink-0">
                      <Link
                        href={`/streams/${stream.streamId}`}
                        className="h-10 px-5 inline-flex items-center justify-center rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)] text-[#9E9E9E] hover:text-white hover:border-[rgba(255,255,255,0.16)] font-medium text-sm transition-all cursor-pointer hover:-translate-y-0.5"
                      >
                        Configure Room
                      </Link>
                      
                      {(!stream.creatorId || stream.creatorId === user.id) && (
                        <button
                          onClick={() => handleDeleteStream(stream.streamId)}
                          className="h-10 w-10 flex items-center justify-center rounded-lg bg-[#111111] border border-red-900/30 text-red-500 hover:text-red-400 hover:border-red-500/50 transition-all cursor-pointer hover:-translate-y-0.5"
                          title="Delete Stream"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#171717] border border-[rgba(255,255,255,0.08)] rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-[#111111] rounded-2xl border border-[rgba(255,255,255,0.08)]">
                  <Video size={28} className="text-[#5C5C5C]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-white">No streams found</h3>
                  <p className="text-sm text-[#9E9E9E]">Create a new stream and share your screen in real time.</p>
                </div>
                <Link
                  href="/communities"
                  className="h-10 px-5 inline-flex items-center justify-center rounded-lg bg-[#6366F1] hover:bg-[#5053E4] text-white font-medium text-sm transition-all shadow-sm"
                >
                  Create Stream
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: COMMUNITIES LIST */}
        {activeTab === "communities" && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-6">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white tracking-tight">Communities</h2>
                <p className="text-sm text-[#9E9E9E] font-medium">Manage and join developers' streaming groups</p>
              </div>

              <Link
                href="/communities/create"
                className="h-10 px-5 inline-flex items-center justify-center rounded-lg bg-[#6366F1] hover:bg-[#5053E4] text-white font-medium text-sm transition-all shadow-sm cursor-pointer hover:-translate-y-0.5"
              >
                Create Circle
              </Link>
            </div>

            {communities.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {communities.map((community) => (
                  <div key={community.communityId} className="p-6 bg-[#171717] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] rounded-2xl flex flex-col justify-between gap-5 group transition-all duration-200">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3.5">
                        <div className="h-10 w-10 rounded-xl bg-[#111111] flex items-center justify-center border border-[rgba(255,255,255,0.08)] text-[#6366F1] font-semibold text-base uppercase">
                          {community.name.substring(0, 2)}
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-white group-hover:text-[#6366F1] transition-colors">{community.name}</h4>
                          <span className="text-[9px] font-mono text-[#5C5C5C] uppercase tracking-wider font-semibold border border-[rgba(255,255,255,0.08)] px-1.5 py-0.5 rounded bg-[#111111] mt-1 inline-block">OWNER</span>
                        </div>
                      </div>
                      <p className="text-sm text-[#9E9E9E] leading-relaxed max-w-sm">
                        {community.description || "No description provided."}
                      </p>
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t border-[rgba(255,255,255,0.08)]">
                      <span className="text-xs text-[#5C5C5C] font-semibold">142 Active Members</span>
                      <Link
                        href={`/communities/${community.communityId}`}
                        className="h-9 px-4 inline-flex items-center justify-center rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.16)] text-[#9E9E9E] hover:text-white font-medium text-xs transition-all cursor-pointer hover:-translate-y-0.5"
                      >
                        Open Circle
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#171717] border border-[rgba(255,255,255,0.08)] rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-[#111111] rounded-2xl border border-[rgba(255,255,255,0.08)]">
                  <Users size={28} className="text-[#5C5C5C]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-white">No communities found</h3>
                  <p className="text-sm text-[#9E9E9E]">Build circles with other developers to broadcast together.</p>
                </div>
                <Link
                  href="/communities/create"
                  className="h-10 px-5 inline-flex items-center justify-center rounded-lg bg-[#6366F1] hover:bg-[#5053E4] text-white font-medium text-sm transition-all shadow-sm"
                >
                  Create Community
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: AI ASSISTANT VIEW */}
        {activeTab === "ai-assistant" && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
            <div className="border-b border-[rgba(255,255,255,0.08)] pb-6 space-y-2">
              <h2 className="text-3xl font-bold text-white tracking-tight">AI Assistant</h2>
              <p className="text-sm text-[#9E9E9E] font-medium">Interact with the real-time AI helper for code feedback and guidance</p>
            </div>

            <div className="bg-[#111111] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 shadow-sm">
              <AIAssistant
                streamTitle="Global Dashboard"
                streamDescription="Interactive developer help dashboard."
              />
            </div>
          </div>
        )}

        {/* TAB 5: SETTINGS (Horizontally and Vertically Centered Grid Layout) */}
        {activeTab === "settings" && (
          <div 
            className="w-full flex items-center justify-center"
            style={{ minHeight: "calc(100vh - 144px)" }}
          >
            <div className="w-full max-w-[560px] bg-[#171717] border border-[rgba(255,255,255,0.08)] rounded-2xl p-6 md:p-8 space-y-6 shadow-sm">
              <div className="border-b border-[rgba(255,255,255,0.08)] pb-4 space-y-1">
                <h2 className="text-xl font-bold text-white tracking-tight">Settings</h2>
                <p className="text-xs text-[#9E9E9E] font-medium">Configure profile and broadcast defaults</p>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Profile Name (Col 1) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-white uppercase tracking-wider block">
                    Profile Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full h-10 px-4 bg-[#111111] border border-[rgba(255,255,255,0.08)] focus:border-[rgba(255,255,255,0.16)] focus:ring-1 focus:ring-[#6366F1] rounded-xl text-white text-xs outline-none transition-all placeholder-[#5C5C5C]"
                  />
                </div>

                {/* Preferred Category (Col 2) */}
                <div className="space-y-2">
                  <label className="text-[10px] font-semibold text-white uppercase tracking-wider block">
                    Stream Category
                  </label>
                  <select
                    value={defaultCategory}
                    onChange={(e) => setDefaultCategory(e.target.value)}
                    className="w-full h-10 px-4 bg-[#111111] border border-[rgba(255,255,255,0.08)] focus:border-[rgba(255,255,255,0.16)] focus:ring-1 focus:ring-[#6366F1] rounded-xl text-white text-xs outline-none transition-all cursor-pointer"
                  >
                    <option value="TypeScript">TypeScript</option>
                    <option value="React">React</option>
                    <option value="Next.js">Next.js</option>
                    <option value="Python">Python</option>
                    <option value="Go">Go</option>
                    <option value="AWS">AWS</option>
                  </select>
                </div>

                {/* Description (Full Width) */}
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-semibold text-white uppercase tracking-wider block">
                    Default Stream Description
                  </label>
                  <textarea
                    value={streamDescription}
                    onChange={(e) => setStreamDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-[#111111] border border-[rgba(255,255,255,0.08)] focus:border-[rgba(255,255,255,0.16)] focus:ring-1 focus:ring-[#6366F1] rounded-xl text-white text-xs outline-none transition-all resize-none placeholder-[#5C5C5C]"
                  />
                  <p className="text-[10px] text-[#5C5C5C]">
                    This description is automatically selected when launching a new stream.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[rgba(255,255,255,0.08)]">
                <button
                  onClick={handleSaveChanges}
                  disabled={isSaving}
                  className="h-10 px-5 rounded-lg bg-[#6366F1] hover:bg-[#5053E4] disabled:bg-[#6366F1]/50 text-white font-medium text-sm transition-all cursor-pointer hover:-translate-y-0.5"
                >
                  {isSaving ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: STREAM KEYS */}
        {activeTab === "stream-keys" && (
          <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
            <div className="border-b border-[rgba(255,255,255,0.08)] pb-6 space-y-2">
              <h2 className="text-3xl font-bold text-white tracking-tight">Stream Keys</h2>
              <p className="text-sm text-[#9E9E9E] font-medium">Use these credentials in your streaming software (OBS, Streamlabs) to go live</p>
            </div>

            {streams.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {streams.map((stream) => (
                  <StreamKeyCard key={stream.streamId} stream={stream} />
                ))}
              </div>
            ) : (
              <div className="bg-[#171717] border border-[rgba(255,255,255,0.08)] rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
                <div className="p-4 bg-[#111111] rounded-2xl border border-[rgba(255,255,255,0.08)]">
                  <Key size={28} className="text-[#5C5C5C]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-white">No stream rooms available</h3>
                  <p className="text-sm text-[#9E9E9E]">Create a stream room first to generate ingest stream keys.</p>
                </div>
                <Link
                  href="/communities"
                  className="h-10 px-5 inline-flex items-center justify-center rounded-lg bg-[#6366F1] hover:bg-[#5053E4] text-white font-medium text-sm transition-all shadow-sm"
                >
                  Create Stream
                </Link>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
