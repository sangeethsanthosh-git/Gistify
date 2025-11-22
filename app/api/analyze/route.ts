// app/api/analyze/route.ts
import { NextRequest, NextResponse } from "next/server";
import pdf from "pdf-extraction";
import { analyzeDocument } from "@/lib/agents";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    let text = (formData.get("text") as string) || "";
    const file = formData.get("file");

    if (file instanceof File && file.type === "application/pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const data = await pdf(buffer);
      text += "\n" + (data.text || "");
    }

    if (!text.trim()) {
      return NextResponse.json(
        { error: "No text provided. Paste text or upload a PDF." },
        { status: 400 }
      );
    }

    const analysis = await analyzeDocument(text);
    return NextResponse.json(analysis);
  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      { error: "Something went wrong while analyzing the document." },
      { status: 500 }
    );
  }
}
