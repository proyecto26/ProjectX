import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createWorkerOptions } from '@projectx/core';
import { Worker } from '@temporalio/worker';
import path from 'path';

import { ActivitiesService } from '../activities/activities.service';

@Injectable()
export class WorkerService implements OnModuleInit {
  private worker: Worker;
  readonly logger = new Logger(WorkerService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly activitiesService: ActivitiesService
  ) {}

  async onModuleInit() {
    try {
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
      /*
      const worker = await Worker.create({
        workflowsPath,
        taskQueue: this.taskQueue,
        activities,
      });*/
      const workerOptions = await createWorkerOptions(
        this.configService,
        workflowsPath
      );

      const worker = await Worker.create({
        ...workerOptions,
        activities,
      });

      worker.run();
      this.worker = worker;
      console.log('Started worker!');
    } catch (error) {
      this.logger.error(error);
    }
  }

  async onModuleDestroy() {
    if (this.worker) {
      this.worker.shutdown();
    }
  }
}
