import { continueAsNew, sleep, workflowInfo } from "@temporalio/workflow";

const MAX_NUMBER_OF_EVENTS = 10000;

export async function createOrder(email?: string): Promise<void> {
  
  // Long-duration workflow
  while (workflowInfo().historyLength < MAX_NUMBER_OF_EVENTS) {
    await sleep(1000);
  }

  await continueAsNew<typeof createOrder>(email);
}