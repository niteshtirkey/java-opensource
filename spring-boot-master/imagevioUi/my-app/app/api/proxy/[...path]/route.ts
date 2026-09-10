import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const targetPath = path ? path.join("/") : "";
    const body = await req.json().catch(() => ({}));

    // Forward relevant security and session headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const sessionId = req.headers.get("x-session-id");
    if (sessionId) headers["X-Session-ID"] = sessionId;

    const auth = req.headers.get("authorization");
    if (auth) headers["Authorization"] = auth;

    const response = await fetch(`${BACKEND_URL}/${targetPath}`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      {
        session_status: "blocked",
        error_message: "Failed to connect to backend server. Make sure Spring Boot is running on port 8080.",
        parsed_operations: [],
      },
      { status: 502 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const targetPath = path ? path.join("/") : "";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const sessionId = req.headers.get("x-session-id");
    if (sessionId) headers["X-Session-ID"] = sessionId;

    const auth = req.headers.get("authorization");
    if (auth) headers["Authorization"] = auth;

    const response = await fetch(`${BACKEND_URL}/${targetPath}`, {
      method: "GET",
      headers,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    console.error("Proxy GET error:", error);
    return NextResponse.json(
      {
        session_status: "blocked",
        error_message: "Failed to connect to backend server. Make sure Spring Boot is running on port 8080.",
      },
      { status: 502 }
    );
  }
}

