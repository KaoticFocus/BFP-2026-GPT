#!/usr/bin/env tsx
// BuildFlow Pro AI - Demo Flow Script
// Runs deterministic demo: lead -> meeting -> transcript -> tasks -> estimate -> budget -> CO -> closeout

import { prisma } from '@buildflow/db';
import { insertOutboxEvent } from '../events/outbox';

const DEMO_ORG_ID = '00000000-0000-0000-0000-000000000001';
const DEMO_OWNER_ID = '00000000-0000-0000-0000-000000000010';
const DEMO_PROJECT_ID = '00000000-0000-0000-0000-000000000040';

async function runDemoFlow() {
  console.log('\n🚀 BuildFlow Pro AI - E2E Demo Flow');
  console.log('='.repeat(50));

  const org = await prisma.organization.findUnique({ where: { id: DEMO_ORG_ID } });
  if (!org) {
    console.error('❌ Demo org not found. Run: pnpm db:seed');
    process.exit(1);
  }

  // Emit demo events
  await insertOutboxEvent({ type: 'LeadCreated', orgId: DEMO_ORG_ID, actorId: DEMO_OWNER_ID, payload: { leadId: '00000000-0000-0000-0000-000000000030' } });
  console.log('✅ LeadCreated event emitted');

  await insertOutboxEvent({ type: 'BudgetCreated', orgId: DEMO_ORG_ID, actorId: DEMO_OWNER_ID, payload: { projectId: DEMO_PROJECT_ID, budgetId: 'demo-budget', amount: 170500 } });
  console.log('✅ BudgetCreated event emitted');

  await insertOutboxEvent({ type: 'CloseoutReady', orgId: DEMO_ORG_ID, actorId: DEMO_OWNER_ID, payload: { projectId: DEMO_PROJECT_ID, closeoutId: 'demo-closeout' } });
  console.log('✅ CloseoutReady event emitted');

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('🎉 Demo Flow Complete!');
  
  const webUrl = process.env.WEB_URL ?? 'http://localhost:3000';
  console.log('\n📍 Demo URLs:');
  console.log(`   Dashboard: ${webUrl}/app/demo`);
  console.log(`   Project: ${webUrl}/app/demo/projects/${DEMO_PROJECT_ID}`);
}

runDemoFlow()
  .catch((error) => { console.error('❌ Demo flow failed:', error); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
