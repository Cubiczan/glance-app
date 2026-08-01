"use client";

import React, { useState, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Eye,
  Upload,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  RotateCcw,
  Camera,
  Shield,
  Zap,
  Target,
  Brain,
  CheckCircle2,
  Clock,
  X,
} from "lucide-react";

interface Suggestion {
  icon: string;
  title: string;
  description: string;
}

interface Analysis {
  context_type: string;
  summary: string;
  detected_elements: string[];
  user_intent: string;
  suggestions: Suggestion[];
  urgency: "low" | "medium" | "high";
  confidence: number;
}

type AppState = "idle" | "analyzing" | "done" | "error";

const CONTEXT_COLORS: Record<string, string> = {
  error: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  code: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
  spreadsheet: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  form: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  document: "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300",
  design: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300",
  physical_object: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  screen: "bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300",
  presentation: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300",
  graph_chart: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-300",
  email: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  chat: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300",
};

const URGENCY_STYLES: Record<string, string> = {
  low: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20",
  medium: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
  high: "text-red-600 bg-red-50 dark:bg-red-900/20",
};

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processImage = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Image must be under 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      setAppState("analyzing");
      setErrorMsg("");

      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: dataUrl }),
        });
        const data = await res.json();

        if (data.error) {
          setErrorMsg(data.error);
          setAppState("error");
        } else {
          setAnalysis(data.analysis);
          setAppState("done");
        }
      } catch {
        setErrorMsg("Network error. Please try again.");
        setAppState("error");
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processImage(file);
    },
    [processImage]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processImage(file);
    },
    [processImage]
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      for (const item of items) {
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) processImage(file);
          break;
        }
      }
    },
    [processImage]
  );

  const reset = () => {
    setAppState("idle");
    setImagePreview(null);
    setAnalysis(null);
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      onPaste={handlePaste}
    >
      {/* Header */}
      <header className="border-b border-border/50 px-4 sm:px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Glance</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 hidden sm:inline-flex">
              Second Nature
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Images are processed in real-time, never stored</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Hero — only in idle state */}
          {appState === "idle" && (
            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                Just glance at it.
                <br />
                <span className="bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                  AI does the rest.
                </span>
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto text-sm sm:text-base">
                Drop a screenshot, photo, or anything you&apos;re looking at. Glance
                understands the context and tells you what you need — before you
                even ask.
              </p>
            </div>
          )}

          {/* Two-column layout: Image + Analysis */}
          {(appState !== "idle" || imagePreview) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Panel */}
              <Card className="overflow-hidden">
                <div className="aspect-video bg-muted/50 relative flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Uploaded content"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-muted-foreground flex flex-col items-center gap-2">
                      <Eye className="w-10 h-10 opacity-30" />
                      <span className="text-sm">Your image will appear here</span>
                    </div>
                  )}

                  {/* Processing overlay */}
                  {appState === "analyzing" && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full border-2 border-violet-200 border-t-violet-600 animate-spin" />
                        <Sparkles className="w-5 h-5 text-violet-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Understanding context...
                      </p>
                    </div>
                  )}
                </div>

                {/* Image controls */}
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {appState === "done" && analysis && (
                      <>
                        <Badge className={CONTEXT_COLORS[analysis.context_type] || CONTEXT_COLORS.other} variant="secondary">
                          {analysis.context_type.replace("_", " ")}
                        </Badge>
                        <span className={URGENCY_STYLES[analysis.urgency]}>
                          {analysis.urgency === "high" && <AlertTriangle className="w-3 h-3 inline mr-1" />}
                          {analysis.urgency === "medium" && <Clock className="w-3 h-3 inline mr-1" />}
                          {analysis.urgency === "low" && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                          {analysis.urgency}
                        </span>
                      </>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={reset} className="text-xs gap-1">
                    <RotateCcw className="w-3.5 h-3.5" />
                    New
                  </Button>
                </CardContent>
              </Card>

              {/* Analysis Panel */}
              <div className="space-y-4">
                {appState === "analyzing" && (
                  <div className="space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="grid gap-3 pt-2">
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                  </div>
                )}

                {appState === "done" && analysis && (
                  <>
                    {/* Summary */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Brain className="w-4 h-4 text-violet-600" />
                        <h2 className="text-sm font-semibold">Context Understanding</h2>
                        <Badge variant="outline" className="text-[10px] ml-auto">
                          {Math.round(analysis.confidence * 100)}% confidence
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {analysis.summary}
                      </p>
                    </div>

                    {/* Detected Elements */}
                    {analysis.detected_elements.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-4 h-4 text-fuchsia-600" />
                          <h2 className="text-sm font-semibold">What I See</h2>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {analysis.detected_elements.map((el, i) => (
                            <Badge key={i} variant="secondary" className="text-xs font-normal">
                              {el}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* User Intent */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        <h2 className="text-sm font-semibold">What You Need</h2>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {analysis.user_intent}
                      </p>
                    </div>

                    {/* Suggestions */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <h2 className="text-sm font-semibold">How I Can Help</h2>
                      </div>
                      <div className="grid gap-3">
                        {analysis.suggestions.map((s, i) => (
                          <Card
                            key={i}
                            className="group cursor-pointer hover:shadow-md transition-shadow border-border/50"
                          >
                            <CardContent className="p-4 flex gap-3">
                              <span className="text-xl flex-shrink-0 mt-0.5">{s.icon}</span>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className="text-sm font-medium">{s.title}</h3>
                                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                  {s.description}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {appState === "error" && (
                  <Card className="border-red-200 dark:border-red-900/50">
                    <CardContent className="p-4 flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-300">
                          Analysis Failed
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">{errorMsg}</p>
                        <Button variant="outline" size="sm" onClick={reset} className="mt-3 text-xs">
                          Try Again
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {/* Upload Zone — idle state */}
          {appState === "idle" && (
            <div
              className={`max-w-2xl mx-auto border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
                dragOver
                  ? "border-violet-500 bg-violet-50 dark:bg-violet-900/10"
                  : "border-border hover:border-violet-300 hover:bg-muted/30"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-fuchsia-100 dark:from-violet-900/30 dark:to-fuchsia-900/30 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-violet-600" />
                </div>
                <div>
                  <p className="font-medium">
                    Drop an image, paste from clipboard, or click to upload
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Screenshots, photos, whiteboard captures — anything visual
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5" /> Camera
                  </span>
                  <span className="flex items-center gap-1">
                    Ctrl+V
                  </span>
                  <span className="flex items-center gap-1">
                    Drag & Drop
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 px-4 sm:px-6 py-4 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>Built for the Second Nature Hackathon — Meta AI Glasses Challenge</p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3" /> Privacy-first: no images stored
            </span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Powered by Vision AI
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
