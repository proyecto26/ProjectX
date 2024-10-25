import { sleep } from "@temporalio/workflow";

export async function loginUserWorkflow(email?: string): Promise<void> {
  await sleep(3000);
  console.log('User logged in', email);
}