import { registerEventHandler } from '@buildflow/events';

// Register all event consumers
export function initializeConsumers(): void {
  // Example: Notification consumer for leads
  registerEventHandler('LeadCreated', 'notification:lead-created', async (event) => {
    console.log(`[Consumer] LeadCreated: ${event.payload.leadId}`);
  });
  
  registerEventHandler('TaskCreated', 'notification:task-created', async (event) => {
    console.log(`[Consumer] TaskCreated: ${event.payload.taskId}`);
  });
  
  registerEventHandler('CloseoutReady', 'notification:closeout-ready', async (event) => {
    console.log(`[Consumer] CloseoutReady: ${event.payload.projectId}`);
  });
  
  console.log('✅ Event consumers initialized');
}
