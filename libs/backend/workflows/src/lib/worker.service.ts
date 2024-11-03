/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Worker } from '@temporalio/worker';

import { createWorkerOptions } from './worker';
import { delay } from './utils';

export interface WorkerServiceOptions<T> {
  activitiesService: T;
  workflowsPath: string;
}

@Injectable()
export class WorkerService<T extends Record<string, unknown>>
  implements OnModuleInit, OnModuleDestroy
{
  readonly logger = new Logger(WorkerService.name);
  private worker?: Worker;
  constructor(
    private readonly configService: ConfigService,
    @Inject('WORKER_OPTIONS')
    private readonly workerOptions: WorkerServiceOptions<T>
  ) {}

  async onModuleInit() {
    await delay(2000); // Delay the worker initialization to allow the server to start
    this.initializeWorkerWithRetry();
  }

  async onModuleDestroy() {
    this.worker?.shutdown();
  }

  private async initializeWorkerWithRetry(retries = 5, delayMs = 10000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        this.logger.debug(`🚀 Attempt ${attempt} to start Temporal worker...`);
        const activities: Record<string, Function> = {};
        const activitiesServiceInstance = this.workerOptions.activitiesService;
        for (const key of Object.getOwnPropertyNames(
          Object.getPrototypeOf(activitiesServiceInstance)
        )) {
          if (['caller', 'callee', 'arguments'].includes(key)) {
            continue;
          }
          const property = activitiesServiceInstance[key];

          // Verifica si la propiedad es un método
          if (typeof property === 'function') {
            // Vincula el método al contexto de this.activitiesService
            activities[key] = property.bind(
              this.workerOptions.activitiesService
            );
          }
        }

        const workerOptions = await createWorkerOptions(
          this.configService,
          this.workerOptions.workflowsPath
        );

        const worker = await Worker.create({
          ...workerOptions,
          activities,
        });

        await worker.run();
        this.worker = worker;
        this.logger.debug('🏃 Temporal worker is running!');
        return; // Exit the function if the worker starts successfully
      } catch (error) {
        this.logger.error(
          `Attempt ${attempt} failed: ${(error as Error).message}`
        );
        if (attempt < retries) {
          this.logger.debug(`Retrying in ${delayMs / 1000} seconds...`);
          await delay(delayMs);
        } else {
          this.logger.error('All retry attempts failed.');
          throw error; // Rethrow the error after all retries have failed
        }
      }
    }
  }
}
