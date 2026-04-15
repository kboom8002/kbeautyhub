import { NextResponse } from "next/server";
import { QISSceneService } from "@/domain/qis-scene";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await QISSceneService.upsert(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const result = await QISSceneService.list();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
