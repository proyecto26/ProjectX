import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ClientService } from './client.service';
import { WorkerService, WorkerServiceOptions } from './worker.service';

interface WorkerModuleAsyncOptions<T> {
  imports?: Array<Type<any> | DynamicModule | Promise<DynamicModule>>;
  useFactory: (...args: any[]) => Promise<WorkerServiceOptions<T>>;
  inject?: Array<Type<any> | string | symbol>;
}

@Module({
  controllers: [],
  providers: [ClientService],
  exports: [ClientService],
})
export class WorkflowsModule {
  static registerAsync<T>(
    options: WorkerModuleAsyncOptions<T>
  ): DynamicModule {
    const asyncProviders: Provider[] = [
      {
        provide: 'WORKER_OPTIONS',
        useFactory: async (...args: any[]) => {
          const { workflowsPath, activitiesService } = await options.useFactory(
            ...args
          );
          return { activitiesService, workflowsPath };
        },
        inject: [...(options.inject || [])],
      },
    ];

    return {
      module: WorkflowsModule,
      imports: [...(options.imports || []), ConfigModule],
      providers: [...asyncProviders, WorkerService],
      exports: [WorkerService],
    };
  }
}
