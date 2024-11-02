import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWorkerOptions } from '@projectx/workflows';
import { Worker } from '@temporalio/worker';
import path from 'path';

import { ActivitiesService } from '../activities/activities.service';
import { delay } from '@projectx/core';

@Injectable()
export class WorkerService implements OnModuleInit {
  private worker: Worker;
  readonly logger = new Logger(WorkerService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly activitiesService: ActivitiesService
  ) {}

  async onModuleInit() {
    await delay(2000); // Delay the worker initialization to allow the server to start
    this.initializeWorkerWithRetry();
  }

  async onModuleDestroy() {
    if (this.worker) {
      this.worker.shutdown();
    }
  }

  private async initializeWorkerWithRetry(retries = 5, delayMs = 10000) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        this.logger.debug(`🚀 Attempt ${attempt} to start Temporal worker...`);
        const activities = {};
        for (const key of Object.getOwnPropertyNames(
          Object.getPrototypeOf(this.activitiesService)
        )) {
          const property = this.activitiesService[key];

          // Verifica si la propiedad es un método
          if (typeof property === 'function') {
            // Vincula el método al contexto de this.activitiesService
            activities[key] = property.bind(this.activitiesService);
          }
        }

        const workflowsPath = path.join(__dirname, '/workflows');
        const workerOptions = await createWorkerOptions(
          this.configService,
          workflowsPath
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
        this.logger.error(`Attempt ${attempt} failed: ${error.message}`);
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
