"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";

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

function getGradientFromTitle(title: string) {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  const gradients = [
    "from-indigo-950 to-slate-900",
    "from-neutral-900 to-zinc-800",
    "from-slate-950 to-neutral-900",
  ];
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}

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

export default function DashboardClient({ user, streams, communities }: Props) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "streams" | "communities" | "settings">("dashboard");

  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const [isSaving, setIsSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

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
  const totalStreamsCount = streams.length;
  const communitiesCount = communities.length;
  
  const latestStream = streams[0] || null;
  const isLive = streams.some((s) => s.status === "LIVE");
  
  const currentStreamStatus = useMemo(() => {
    if (isLive) return "LIVE";
    if (latestStream && latestStream.status === "CONNECTING") return "CONNECTING";
    return "OFFLINE";
  }, [isLive, latestStream]);

  const totalViewCount = useMemo(() => {
    return streams.reduce((sum, s) => sum + (s.viewCount || 0), 0);
  }, [streams]);

  const handleTabChange = (tab: "dashboard" | "streams" | "communities" | "settings") => {
    setActiveTab(tab);
  };

  // Render Sidebar
  const renderSidebar = () => {
    const navItems = [
      { id: "dashboard", label: "Dashboard", icon: "📊", disabled: false },
      { id: "streams", label: "My Streams", icon: "🎬", disabled: false },
      { id: "communities", label: "Communities", icon: "👥", disabled: false },
      { id: "analytics", label: "Analytics", icon: "📈", disabled: true },
      { id: "settings", label: "Settings", icon: "⚙️", disabled: false },
    ];

    return (
      <aside className="w-full md:w-60 flex-shrink-0 bg-surface border border-border-main rounded-[14px] p-4 space-y-6">
        <div className="flex items-center gap-3 px-3 py-1">
          <img
            src={user.imageUrl}
            alt={user.username}
            className="h-8 w-8 rounded-full border border-border-main"
          />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-txt-primary line-clamp-1">{user.username}</span>
            <span className="text-[10px] text-txt-muted font-medium">Creator Space</span>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            if (item.disabled) {
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-bold text-txt-muted select-none cursor-not-allowed"
                >
                  <div className="flex items-center gap-3">
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[9px] bg-card-bg border border-border-main text-txt-muted px-2 py-0.5 rounded-full font-bold uppercase scale-90">
                    Soon
                  </span>
                </div>
              );
            }

            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as any)}
                className={`flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition duration-200 cursor-pointer ${
                  isActive
                    ? "bg-brand/10 text-brand border border-brand/20"
                    : "text-txt-secondary hover:text-txt-primary hover:bg-hover-bg border border-transparent"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    );
  };

  // Render Metric Card
  const renderMetricCard = (title: string, value: string | number, statusType?: "LIVE" | "CONNECTING" | "OFFLINE") => {
    return (
      <div className="bg-card-bg border border-border-main rounded-[14px] p-6 flex flex-col justify-between h-28 hover:border-border-main/80 transition duration-200 shadow-sm">
        <span className="text-[10px] font-bold text-txt-muted uppercase tracking-wider">{title}</span>
        <div className="flex items-center gap-2 pt-2">
          {statusType && (
            <span className={`h-2.5 w-2.5 rounded-full ${
              statusType === "LIVE" ? "bg-rose-500 animate-pulse" :
              statusType === "CONNECTING" ? "bg-amber-500 animate-pulse" : "bg-txt-muted"
            }`} />
          )}
          <span className="text-2xl font-black text-txt-primary tracking-tight">{value}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Navigation */}
        {renderSidebar()}

        {/* Dynamic Main Dashboard Pane */}
        <main className="flex-grow space-y-8">
          
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Dashboard Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-border-main pb-6">
                <div className="space-y-1">
                  <h1 className="text-3xl font-extrabold text-txt-primary tracking-tight">
                    Welcome Back, {user.username}
                  </h1>
                  <p className="text-xs text-txt-muted font-medium">
                    {currentDateString} • Stream Workspace
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {latestStream ? (
                    <>
                      <Link
                        href={`/streams/${latestStream.streamId}`}
                        className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs tracking-wider transition duration-200 cursor-pointer"
                      >
                        Start Browser Stream
                      </Link>
                      <Link
                        href={`/streams/${latestStream.streamId}`}
                        className="px-5 py-2.5 rounded-xl bg-card-bg border border-border-main hover:bg-hover-bg text-txt-secondary hover:text-txt-primary font-bold text-xs tracking-wider transition duration-200 cursor-pointer"
                      >
                        OBS Settings
                      </Link>
                    </>
                  ) : (
                    <Link
                      href="/communities"
                      className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs tracking-wider transition duration-200 cursor-pointer"
                    >
                      Choose Community & Create Stream
                    </Link>
                  )}
                </div>
              </div>

              {/* Overview Metrics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {renderMetricCard("Stream Status", currentStreamStatus, currentStreamStatus)}
                {renderMetricCard("Current Viewers", totalViewCount)}
                {renderMetricCard("Total Streams", totalStreamsCount)}
                {renderMetricCard("Created Communities", communitiesCount)}
              </div>

              {/* Layout Content Split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left: Recent Streams */}
                <div className="lg:col-span-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-txt-primary">Recent Stream Sessions</h3>
                    <button
                      onClick={() => setActiveTab("streams")}
                      className="text-xs text-brand hover:text-brand-hover font-bold transition cursor-pointer"
                    >
                      View All Streams
                    </button>
                  </div>

                  {streams.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {streams.slice(0, 4).map((stream) => {
                        const gradientClass = getGradientFromTitle(stream.title);
                        const isStreamLive = stream.status === "LIVE";
                        return (
                          <div
                            key={stream.streamId}
                            className="group flex flex-col bg-card-bg border border-border-main hover:border-brand/40 rounded-[14px] overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.05)]"
                          >
                            <div className="relative aspect-video w-full bg-[#0a0a0a] overflow-hidden">
                              <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} flex flex-col justify-between p-4`}>
                                <span className="text-white/40 text-[9px] font-bold uppercase tracking-wider">
                                  CodeLive Session
                                </span>
                                <h5 className="text-white font-extrabold text-xs text-center drop-shadow px-2 line-clamp-2">
                                  {stream.title}
                                </h5>
                                <span className="text-white/40 text-[9px] font-bold uppercase tracking-wider text-right">
                                  {formatISOToDate(stream.createdAt, false)}
                                </span>
                              </div>

                              <div className="absolute top-3 left-3 z-10">
                                {isStreamLive ? (
                                  <span className="bg-rose-600/90 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-xl">
                                    LIVE
                                  </span>
                                ) : (
                                  <span className="bg-surface/90 text-txt-secondary border border-border-main font-bold text-[9px] uppercase px-2 py-0.5 rounded-xl">
                                    OFFLINE
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                              <div className="space-y-1">
                                <h4 className="font-bold text-sm text-txt-primary line-clamp-1 group-hover:text-brand transition">{stream.title}</h4>
                                <p className="text-xs text-txt-secondary line-clamp-2 leading-relaxed">
                                  {stream.description || "No stream description provided."}
                                </p>
                              </div>

                              <Link
                                href={`/streams/${stream.streamId}`}
                                className="w-full text-center py-2.5 rounded-xl border border-border-main hover:border-border-main/80 text-txt-secondary hover:text-txt-primary font-bold text-xs bg-surface transition duration-200 cursor-pointer"
                              >
                                Open Stream Dashboard
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="border border-border-main rounded-[14px] bg-card-bg p-12 text-center space-y-4 shadow-sm">
                      <span className="text-3xl block">📡</span>
                      <h4 className="text-txt-primary font-bold text-sm">No streams created yet.</h4>
                      <p className="text-txt-secondary text-xs max-w-xs mx-auto leading-relaxed">
                        To go live, click create stream and associate your broadcast with a community group.
                      </p>
                      <Link
                        href="/communities"
                        className="inline-block px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs tracking-wider cursor-pointer transition"
                      >
                        Create Your First Stream
                      </Link>
                    </div>
                  )}
                </div>

                {/* Right: Quick Actions */}
                <div className="lg:col-span-4 space-y-6">
                  <h3 className="text-lg font-bold text-txt-primary">Quick Actions</h3>

                  <div className="grid grid-cols-1 gap-4">
                    <Link
                      href="/communities"
                      className="group flex items-center justify-between p-4 rounded-xl bg-card-bg hover:bg-hover-bg border border-border-main transition duration-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🎬</span>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-txt-secondary group-hover:text-txt-primary">Create Stream</span>
                          <span className="text-[10px] text-txt-muted">Go live in a community</span>
                        </div>
                      </div>
                      <span className="text-txt-muted group-hover:text-brand transition text-sm">➔</span>
                    </Link>

                    {latestStream ? (
                      <Link
                        href={`/streams/${latestStream.streamId}`}
                        className="group flex items-center justify-between p-4 rounded-xl bg-card-bg hover:bg-hover-bg border border-border-main transition duration-200 cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">📡</span>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-txt-secondary group-hover:text-txt-primary">Go Live</span>
                            <span className="text-[10px] text-txt-muted">Launch stream encoder</span>
                          </div>
                        </div>
                        <span className="text-txt-muted group-hover:text-brand transition text-sm">➔</span>
                      </Link>
                    ) : (
                      <div className="flex items-center justify-between p-4 rounded-xl bg-card-bg border border-border-main text-txt-muted select-none opacity-50">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">📡</span>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold">Go Live</span>
                            <span className="text-[10px]">Requires a stream session</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <Link
                      href="/communities/create"
                      className="group flex items-center justify-between p-4 rounded-xl bg-card-bg hover:bg-hover-bg border border-border-main transition duration-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">👥</span>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-txt-secondary group-hover:text-txt-primary">Manage Communities</span>
                          <span className="text-[10px] text-txt-muted">Create circles & channels</span>
                        </div>
                      </div>
                      <span className="text-txt-muted group-hover:text-brand transition text-sm">➔</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MY STREAMS LIST */}
          {activeTab === "streams" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-border-main pb-6 space-y-1">
                <h2 className="text-2xl font-extrabold text-txt-primary tracking-tight">My Stream Sessions</h2>
                <p className="text-xs text-txt-muted">Manage all broadcasting history and ingestion records</p>
              </div>

              {streams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {streams.map((stream) => {
                    const gradientClass = getGradientFromTitle(stream.title);
                    const isStreamLive = stream.status === "LIVE";
                    return (
                      <div
                        key={stream.streamId}
                        className="group flex flex-col bg-card-bg border border-border-main hover:border-brand/40 rounded-[14px] overflow-hidden transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.05)]"
                      >
                        <div className="relative aspect-video w-full bg-[#0a0a0a] overflow-hidden">
                          <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} flex flex-col justify-between p-4`}>
                            <span className="text-white/40 text-[9px] font-bold uppercase tracking-wider">
                              CodeLive Session
                            </span>
                            <h5 className="text-white font-extrabold text-xs text-center drop-shadow px-2 line-clamp-2">
                              {stream.title}
                            </h5>
                            <span className="text-white/40 text-[9px] font-bold uppercase tracking-wider text-right">
                              {formatISOToDate(stream.createdAt, true)}
                            </span>
                          </div>

                          <div className="absolute top-3 left-3 z-10">
                            {isStreamLive ? (
                              <span className="bg-rose-600/90 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-xl">
                                LIVE
                              </span>
                            ) : (
                              <span className="bg-surface/90 text-txt-secondary border border-border-main font-bold text-[9px] uppercase px-2 py-0.5 rounded-xl">
                                OFFLINE
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-5 space-y-4 flex-grow flex flex-col justify-between">
                          <div className="space-y-1">
                            <h4 className="font-bold text-sm text-txt-primary line-clamp-1 group-hover:text-brand transition">{stream.title}</h4>
                            <p className="text-xs text-txt-secondary line-clamp-3 leading-relaxed">
                              {stream.description || "No stream description provided."}
                            </p>
                          </div>

                          <Link
                            href={`/streams/${stream.streamId}`}
                            className="w-full text-center py-2.5 rounded-xl border border-border-main hover:border-border-main/80 text-txt-secondary hover:text-txt-primary font-bold text-xs bg-surface transition duration-200 cursor-pointer"
                          >
                            Configure & View Stream
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="border border-border-main rounded-[14px] bg-card-bg p-16 text-center space-y-4 max-w-xl mx-auto shadow-sm">
                  <span className="text-3xl block">📡</span>
                  <h4 className="text-txt-primary font-bold text-base">No stream sessions yet.</h4>
                  <p className="text-txt-secondary text-xs">
                    Start a live stream inside a developer community to build in public.
                  </p>
                  <Link
                    href="/communities"
                    className="inline-block px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs tracking-wider cursor-pointer transition"
                  >
                    Select Community & Create
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COMMUNITIES LIST */}
          {activeTab === "communities" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border-main pb-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-extrabold text-txt-primary tracking-tight">Communities Created</h2>
                  <p className="text-xs text-txt-muted">Manage community topics and member groups owned by you</p>
                </div>

                <Link
                  href="/communities/create"
                  className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs tracking-wider transition duration-200 cursor-pointer"
                >
                  Create Community
                </Link>
              </div>

              {communities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {communities.map((community) => (
                    <div
                      key={community.communityId}
                      className="group p-6 rounded-[14px] bg-card-bg border border-border-main hover:border-brand/35 transition duration-200 shadow-sm"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-txt-primary group-hover:text-brand font-bold text-sm transition">
                            {community.name}
                          </h4>
                          <span className="text-[9px] text-txt-muted font-semibold uppercase tracking-wider bg-surface border border-border-main px-2 py-0.5 rounded-xl">
                            Owner
                          </span>
                        </div>
                        <p className="text-txt-secondary text-xs leading-relaxed line-clamp-2">
                          {community.description}
                        </p>
                        <div className="flex items-center justify-between border-t border-border-main pt-4">
                          <span className="text-[10px] text-txt-muted font-semibold uppercase">
                            Created: {formatISOToDate(community.createdAt, true)}
                          </span>
                          <Link
                            href={`/communities/${community.communityId}`}
                            className="text-xs text-brand hover:text-brand-hover font-bold transition"
                          >
                            Open Circle ➔
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-border-main rounded-[14px] bg-card-bg p-16 text-center space-y-4 max-w-xl mx-auto shadow-sm">
                  <span className="text-3xl block">👥</span>
                  <h4 className="text-txt-primary font-bold text-base">No communities created yet.</h4>
                  <p className="text-txt-secondary text-xs">
                    Create a custom technology community to host and group coding live streams.
                  </p>
                  <Link
                    href="/communities/create"
                    className="inline-block px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover text-white font-bold text-xs tracking-wider cursor-pointer transition"
                  >
                    Create Your First Community
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-border-main pb-6 space-y-1">
                <h2 className="text-2xl font-extrabold text-txt-primary tracking-tight">Workspace Settings</h2>
                <p className="text-xs text-txt-muted">Configure profile identity defaults and broadcast options</p>
              </div>

              <div className="max-w-2xl bg-card-bg border border-border-main rounded-[14px] p-6 space-y-6 shadow-sm">
                
                {/* Form Field 1 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-txt-muted uppercase tracking-wider block">
                    Creator Profile Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface border border-border-main focus:border-brand/45 rounded-xl text-txt-primary text-xs placeholder:text-txt-muted outline-none transition duration-200"
                  />
                  <p className="text-[10px] text-txt-muted leading-normal">
                    This name will appear as the creator identifier under all streams on the discovery dashboard.
                  </p>
                </div>

                {/* Form Field 2 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-txt-muted uppercase tracking-wider block">
                    Default Stream Description
                  </label>
                  <textarea
                    value={streamDescription}
                    onChange={(e) => setStreamDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-surface border border-border-main focus:border-brand/45 rounded-xl text-txt-primary text-xs placeholder:text-txt-muted outline-none transition duration-200 resize-none"
                  />
                  <p className="text-[10px] text-txt-muted leading-normal">
                    Default description loaded when launching a new livestream. Can be customized per stream.
                  </p>
                </div>

                {/* Form Field 3 */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-txt-muted uppercase tracking-wider block">
                    Preferred Stream Category
                  </label>
                  <select
                    value={defaultCategory}
                    onChange={(e) => setDefaultCategory(e.target.value)}
                    className="w-full px-4 py-2.5 bg-surface border border-border-main focus:border-brand/45 rounded-xl text-txt-primary text-xs outline-none transition duration-200 cursor-pointer"
                  >
                    <option value="TypeScript">TypeScript</option>
                    <option value="React">React</option>
                    <option value="Next.js">Next.js</option>
                    <option value="Python">Python</option>
                    <option value="Go">Go</option>
                    <option value="AWS">AWS</option>
                  </select>
                </div>

                <div className="border-t border-border-main pt-6 flex justify-end">
                  <button
                    onClick={handleSaveChanges}
                    disabled={isSaving}
                    className="px-5 py-2.5 rounded-xl bg-brand hover:bg-brand-hover disabled:bg-brand/40 text-white font-bold text-xs tracking-wider transition duration-200 cursor-pointer"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
