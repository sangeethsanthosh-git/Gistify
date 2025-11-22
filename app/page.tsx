"use client";

import { useState, ChangeEvent } from "react";
import { Paperclip, Loader2 } from "lucide-react";

export default function HomePage() {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAnalyze() {
    if (!text.trim() && !file) {
      setError("Paste text or upload a PDF first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      if (text.trim()) form.append("text", text);
      if (file) form.append("file", file);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: form,
      });

      if (!res.ok) throw new Error(await res.text());

      const json = await res.json();

      sessionStorage.setItem("analysis_result", JSON.stringify(json));
      window.location.href = "/result";

    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error.");
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null);
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <section
        className="relative flex items-center justify-center text-center px-6 py-10 md:py-20 h-screen w-full"
        style={{
          backgroundImage: `url("/hero.gif")`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

        <div className="relative z-10 max-w-3xl mx-auto w-full">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight">
          GISTIFY           
          <br />
          <p className="text-sm sm:text-base text-slate-200/80 mt-2">
          Small Summarizer
          </p>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-200/80">
            Upload PDFs or paste text. DocAgent converts them into summaries,
            entities & action plans.
          </p>

          <div className="mt-8 flex justify-center">
            <div className="flex items-center w-full max-w-lg rounded-full bg-white/20 border border-white/30 backdrop-blur-xl overflow-hidden shadow-xl">

              <label className="px-4 cursor-pointer flex items-center">
                <Paperclip size={18} className="text-white" />
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <input
                type="text"
                placeholder="Paste text here…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white px-3 py-3 focus:outline-none"
              />

              <button
                onClick={handleAnalyze}
                disabled={loading}
                className="bg-white text-black text-xs font-semibold px-6 py-2 rounded-full m-2 shadow hover:bg-slate-200 flex items-center gap-2 disabled:opacity-60"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Run"}
              </button>
            </div>
          </div>

          {file && <p className="mt-2 text-xs text-slate-300">{file.name}</p>}
          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
        </div>
      </section>
    </div>
  );
}
