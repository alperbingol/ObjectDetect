import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const apiKey = process.env.HF_API_KEY;
  
    // Log API key presence (do not log the key itself for security)
    console.log("API key present:", !!apiKey);
    if (!apiKey) {
      console.error("Missing Hugging Face API key");
      return NextResponse.json({ error: "Missing Hugging Face API key" }, { status: 500 });
    }

  // Parse the incoming form data
  const formData = await req.formData();
  const file = formData.get("file");
  const threshold = formData.get("threshold");
    console.log("File present:", !!file, "Threshold:", threshold);
    if (!file || !(file instanceof Blob)) {
      console.error("No file uploaded or file is not a Blob");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

  // Send image as raw body with correct Content-Type
  let response, result;
  try {
    response = await fetch("https://api-inference.huggingface.co/models/facebook/detr-resnet-50", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": file.type || "image/jpeg",
      },
      body: file,
    });
    result = await response.json();
    console.log("Hugging Face response status:", response.status);
    console.log("Hugging Face response:", result);
  } catch (err) {
    console.error("Error calling Hugging Face API:", err);
    return NextResponse.json({ error: "Error calling Hugging Face API", details: String(err) }, { status: 500 });
  }

  return NextResponse.json(result, { status: response.status });
}