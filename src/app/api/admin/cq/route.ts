import { NextResponse } from "next/server";
import { CanonicalQuestionService, CanonicalQuestionSchema } from "@/domain/canonical-question";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await CanonicalQuestionService.upsert(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error.message === "CQ_SIGNATURE_DUPLICATE") {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const result = await CanonicalQuestionService.list();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
