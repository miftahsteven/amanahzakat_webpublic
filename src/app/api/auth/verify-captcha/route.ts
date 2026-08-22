import { NextResponse } from "next/server";

const RECAPTCHA_SECRET_KEY =
  process.env.RECAPTCHA_SECRET_KEY || "6Lfqx5ItAAAAAJ221xpdJdyPDXCiTWflwFqGt07D";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Token reCAPTCHA tidak ditemukan." },
        { status: 400 }
      );
    }

    // Bypass verification for simulated offline/testing tokens
    if (token === "test-simulated-token" || token.startsWith("mock-")) {
      return NextResponse.json({ success: true, score: 0.9 });
    }

    // Verify token with Google reCAPTCHA server
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${encodeURIComponent(
      RECAPTCHA_SECRET_KEY
    )}&response=${encodeURIComponent(token)}`;

    const response = await fetch(verifyUrl, {
      method: "POST",
    });

    const data = await response.json();

    if (data.success) {
      return NextResponse.json({
        success: true,
        score: data.score || 1.0,
        hostname: data.hostname,
      });
    } else {
      console.warn("reCAPTCHA validation response:", data);
      return NextResponse.json(
        {
          success: false,
          errorCodes: data["error-codes"] || [],
          message: "Validasi reCAPTCHA gagal. Silakan coba kembali.",
        },
        { status: 422 }
      );
    }
  } catch (error) {
    console.error("reCAPTCHA verification error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada verifikasi reCAPTCHA." },
      { status: 500 }
    );
  }
}
