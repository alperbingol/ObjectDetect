import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.HF_API_KEY;
  

  if (!apiKey) {
    return NextResponse.json({ error: "Missing Hugging Face API key" }, { status: 500 });
  }

  // Parse the incoming form data
  //req.
  const formData = await req.formData();
  const file = formData.get("file");
  const thresholdRaw = formData.get("threshold");
  const threshold = Math.max(0, Math.min(1, Number(thresholdRaw ?? 0.25)));
    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

  // Send image as raw body with correct Content-Type
  let response, result;
  try {
    response = await fetch("https://api-inference.huggingface.co/models/facebook/detr-resnet-50", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": file.type || "image/jpeg", //file.type sadece
      },
      body: file,
    });
    result = await response.json();
  } catch (err) {
    return NextResponse.json({ error: "Error calling Hugging Face API", details: String(err) }, { status: 500 });
  }

  if (!Array.isArray(result)) {
    return NextResponse.json(result, { status: response.status });
  }

  const filtered = result.filter((d: any) => typeof d?.score === "number" && d.score >= threshold);
  return NextResponse.json(filtered, { status: 200 });
}