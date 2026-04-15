import { NextResponse } from 'next/server';
import { MriIngestor } from '@/domain/mri/ingestor';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    
    // 1. Ingest (Will throw if Zod schema validates invalid payload)
    const event = MriIngestor.ingest(payload);

    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error: any) {
    if (error.message.includes("Invalid Payload")) {
      return NextResponse.json({ error: error.message }, { status: 422 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
