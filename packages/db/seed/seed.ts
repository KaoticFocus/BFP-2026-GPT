// BuildFlow Pro AI - Database Seed Script

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fixed UUIDs for demo data (deterministic)
const DEMO_ORG_ID = '00000000-0000-0000-0000-000000000001';
const DEMO_OWNER_ID = '00000000-0000-0000-0000-000000000010';
const DEMO_SALES_ID = '00000000-0000-0000-0000-000000000011';
const DEMO_TECH_ID = '00000000-0000-0000-0000-000000000012';
const DEMO_CUSTOMER_ID = '00000000-0000-0000-0000-000000000020';
const DEMO_LEAD_ID = '00000000-0000-0000-0000-000000000030';
const DEMO_PROJECT_ID = '00000000-0000-0000-0000-000000000040';
const DEMO_VENDOR_ID = '00000000-0000-0000-0000-000000000050';

async function main() {
  console.log('🌱 Seeding database...');

  // Clean existing demo data
  await prisma.organization.deleteMany({ where: { id: DEMO_ORG_ID } });

  // Create demo organization
  const org = await prisma.organization.create({
    data: { id: DEMO_ORG_ID, name: 'BuildFlow Demo Co', slug: 'demo' },
  });
  console.log('✅ Created organization:', org.name);

  // Create demo users
  const owner = await prisma.user.create({
    data: { id: DEMO_OWNER_ID, email: 'owner@demo.buildflow.local', name: 'Demo Owner' },
  });
  const sales = await prisma.user.create({
    data: { id: DEMO_SALES_ID, email: 'sales@demo.buildflow.local', name: 'Demo Sales' },
  });
  const tech = await prisma.user.create({
    data: { id: DEMO_TECH_ID, email: 'tech@demo.buildflow.local', name: 'Demo Tech' },
  });
  console.log('✅ Created users: Owner, Sales, Tech');

  // Create memberships
  await prisma.membership.createMany({
    data: [
      { userId: owner.id, orgId: org.id, role: 'owner' },
      { userId: sales.id, orgId: org.id, role: 'sales' },
      { userId: tech.id, orgId: org.id, role: 'tech' },
    ],
  });
  console.log('✅ Created memberships');

  // Create demo customer
  const customer = await prisma.customer.create({
    data: {
      id: DEMO_CUSTOMER_ID,
      orgId: org.id,
      name: 'Acme Corporation',
      email: 'contact@acme.example.com',
      phone: '555-123-4567',
      address: '123 Main St, Anytown, USA',
    },
  });
  console.log('✅ Created customer:', customer.name);

  // Create demo lead
  const lead = await prisma.lead.create({
    data: {
      id: DEMO_LEAD_ID,
      orgId: org.id,
      customerId: customer.id,
      name: 'Acme Office Renovation',
      source: 'referral',
      status: 'qualified',
      projectType: 'commercial_renovation',
      notes: 'Full office renovation including HVAC, electrical, and finishes.',
    },
  });
  console.log('✅ Created lead:', lead.name);

  // Create demo project
  const project = await prisma.project.create({
    data: {
      id: DEMO_PROJECT_ID,
      orgId: org.id,
      leadId: lead.id,
      customerId: customer.id,
      name: 'Acme Office Renovation',
      status: 'in_progress',
      address: '123 Main St, Anytown, USA',
      startDate: new Date('2026-01-15'),
    },
  });
  console.log('✅ Created project:', project.name);

  // Create demo vendor
  await prisma.vendor.create({
    data: {
      id: DEMO_VENDOR_ID,
      orgId: org.id,
      name: 'Premium Electrical Supply',
      email: 'orders@premiumelectric.example.com',
      type: 'vendor',
    },
  });
  console.log('✅ Created vendor');

  // Create demo session
  await prisma.session.create({
    data: {
      userId: owner.id,
      orgId: org.id,
      token: 'demo-owner-token',
      expiresAt: new Date('2099-12-31'),
    },
  });
  console.log('✅ Created demo session');

  console.log('\n🎉 Seed complete!');
  console.log('\n📋 Demo credentials:');
  console.log('   Org slug: demo');
  console.log('   Owner: owner@demo.buildflow.local');
  console.log('   Token: demo-owner-token');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
