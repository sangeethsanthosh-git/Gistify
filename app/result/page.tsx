"use client";

import { useEffect, useState } from "react";
import { toPng } from "html-to-image";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";

export default function ResultPage() {
  const [data, setData] = useState<any>(null);

  // Load data passed from homepage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("analysis_result");
      if (stored) setData(JSON.parse(stored));
    }
  }, []);

  async function downloadImage() {
    const node = document.getElementById("result-area");
    if (!node) return;

    const dataUrl = await toPng(node, {
      quality: 1,
      pixelRatio: 2,
    });

    const link = document.createElement("a");
    link.download = "docagent-output.png";
    link.href = dataUrl;
    link.click();
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <p>No result found. Go back and run analysis.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white">
      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm hover:text-slate-300 transition"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        <button
          onClick={downloadImage}
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-xl text-sm font-semibold shadow hover:bg-slate-100 transition"
        >
          <Download size={16} />
          Download PNG
        </button>
      </header>

      {/* RESULT CONTAINER */}
      <main className="flex justify-center py-10 px-4">
        <div
          id="result-area"
          className="w-full max-w-3xl bg-white text-black rounded-3xl shadow-2xl p-8 space-y-6"
        >
          {/* DOC TYPE */}
          <section>
            <h2 className="text-lg font-semibold mb-1 text-slate-700">
              Document Type
            </h2>
            <p className="rounded-lg bg-slate-100 p-3">{data.type}</p>
          </section>

          {/* SUMMARY */}
          <section>
            <h2 className="text-lg font-semibold mb-1 text-slate-700">
              Summary
            </h2>
            <p className="rounded-lg bg-slate-100 p-3 leading-relaxed">
              {data.summary}
            </p>
          </section>

          {/* ENTITIES */}
          <section>
            <h2 className="text-lg font-semibold mb-1 text-slate-700">
              Entities
            </h2>
            <div className="rounded-lg bg-slate-100 p-3 space-y-2 text-sm">
              <p>
                <strong>People:</strong>{" "}
                {data.entities.people.join(", ") || "None"}
              </p>
              <p>
                <strong>Organizations:</strong>{" "}
                {data.entities.organizations.join(", ") || "None"}
              </p>
              <p>
                <strong>Locations:</strong>{" "}
                {data.entities.locations.join(", ") || "None"}
              </p>
              <p>
                <strong>Misc:</strong>{" "}
                {data.entities.misc.join(", ") || "None"}
              </p>
            </div>
          </section>

          {/* ACTION PLAN */}
          <section>
            <h2 className="text-lg font-semibold mb-1 text-slate-700">
              Action Plan
            </h2>
            <div className="rounded-lg bg-slate-100 p-3 space-y-2 text-sm">
              <p>
                <strong>Priority:</strong>{" "}
                {data.action_plan.priority}
              </p>
              <p>{data.action_plan.recommended_action}</p>
              <p>
                <strong>Owner:</strong>{" "}
                {data.action_plan.suggested_owner}
              </p>
              {data.action_plan.due_date_suggestion && (
                <p>
                  <strong>Due:</strong>{" "}
                  {data.action_plan.due_date_suggestion}
                </p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
