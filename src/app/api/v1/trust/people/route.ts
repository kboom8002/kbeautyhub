import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Assuming this exists or I will verify
import { z } from 'zod';

// Minimal validation for creation
const CreatePersonSchema = z.object({
  display_name: z.string().min(1),
  person_type: z.string().min(1),
  headline_role: z.string().optional(),
  organization: z.string().optional(),
  credentials_summary: z.string().optional(),
  bio_short: z.string().optional(),
  active_status: z.enum(["active", "inactive"]).default("active"),
  visibility_status: z.enum(["private_internal", "public_summary", "public_profile", "hidden"]).default("private_internal"),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    
    const filter = type ? { person_type: type } : {};
    
    const people = await prisma.personSSoT.findMany({
      where: filter,
      orderBy: { created_at: 'desc' }
    });
    
    return NextResponse.json({ success: true, data: people });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreatePersonSchema.parse(body);
    
    const person = await prisma.personSSoT.create({
      data: {
        display_name: validated.display_name,
        person_type: validated.person_type,
        headline_role: validated.headline_role,
        organization: validated.organization,
        credentials_summary: validated.credentials_summary,
        bio_short: validated.bio_short,
        active_status: validated.active_status,
        visibility_status: validated.visibility_status,
      }
    });

    return NextResponse.json({ success: true, data: person }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
