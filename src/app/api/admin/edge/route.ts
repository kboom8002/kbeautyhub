import { NextResponse } from "next/server";
import { GraphEdgeService } from "@/domain/graph-edge";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await GraphEdgeService.upsert(body);
    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    if (error.message === "GRAPH_EDGE_SELF_LOOP_INVALID") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    const result = await GraphEdgeService.list();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
