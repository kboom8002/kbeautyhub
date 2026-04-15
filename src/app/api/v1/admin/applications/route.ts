import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAuthToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')?.split(' ')[1] || req.cookies.get('auth_token')?.value;
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const context = await verifyAuthToken(authHeader);
    if (!['master', 'governance_admin'].includes(context.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const applications = await prisma.tenantApplication.findMany({
      orderBy: { submitted_at: 'desc' }
    });

    return NextResponse.json({ success: true, data: applications });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')?.split(' ')[1] || req.cookies.get('auth_token')?.value;
    const context = await verifyAuthToken(authHeader as string);
    if (!['master', 'governance_admin'].includes(context.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { application_id, status } = await req.json(); // status: 'approved' | 'rejected'
    
    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Process Transaction for approval
    const result = await prisma.$transaction(async (tx) => {
      const application = await tx.tenantApplication.findUnique({
        where: { application_id }
      });

      if (!application) throw new Error("Application not found.");
      if (application.status !== 'pending') throw new Error("Application already processed.");

      const updated = await tx.tenantApplication.update({
        where: { application_id },
        data: {
          status,
          reviewed_at: new Date()
        }
      });

      if (status === 'approved') {
        const generatedPassword = Math.random().toString(36).slice(-8); // Random temporary password
        const isBrand = application.applicant_type === 'brand';

        let provisionedRecordId: string | null = null;
        
        // 1. Provision target entity (Brand or SSoT)
        if (isBrand) {
          const newBrand = await tx.brand.create({
            data: { name: application.company_or_clinic || application.applicant_name }
          });
          provisionedRecordId = newBrand.brand_id;
        } else {
          const newPerson = await tx.personSSoT.create({
            data: {
              display_name: application.applicant_name,
              person_type: 'external_expert',
              organization: application.company_or_clinic,
              visibility_status: 'private_internal'
            }
          });
          provisionedRecordId = newPerson.person_id;
        }

        // 2. Create User Account mapped to the entity
        await tx.userAccount.create({
          data: {
            email: application.email,
            role: isBrand ? 'brand_admin' : 'expert',
            tenant_id: isBrand && provisionedRecordId ? provisionedRecordId : 'SYSTEM',
            person_id: !isBrand ? provisionedRecordId : null
          }
        });

        // 3. Stub Welcome Email Logic
        console.log(`
          [EMAIL DISPATCH STUB]
          TO: ${application.email}
          SUBJECT: Welcome to KBeautyHub - Account Approved!
          BODY:
          Hello ${application.applicant_name},
          
          Your application has been approved by the Master Admin.
          You can now login to your portal at /login.
          
          As requested, this is your initial access email.
          Your temporary access credentials have been securely provisioned.
        `);
      }

      return updated;
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
