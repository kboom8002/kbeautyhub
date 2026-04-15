import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const ApplySchema = z.object({
  applicant_type: z.enum(['brand', 'expert']),
  applicant_name: z.string().min(2),
  email: z.string().email(),
  company_or_clinic: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = ApplySchema.parse(body);
    
    // Create Application in database (Pending Status is default)
    const application = await prisma.tenantApplication.create({
      data: {
        applicant_type: validated.applicant_type,
        applicant_name: validated.applicant_name,
        email: validated.email,
        company_or_clinic: validated.company_or_clinic,
        status: "pending"
      }
    });

    return NextResponse.json({ success: true, application_id: application.application_id }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Invalid format provided.' }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
