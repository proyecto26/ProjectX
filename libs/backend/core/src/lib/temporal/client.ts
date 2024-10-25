import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, Connection } from '@temporalio/client';

@Injectable()
export class ClientService implements OnModuleInit {
  private client: Client | undefined;
  readonly logger = new Logger(ClientService.name);

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const temporalHost = this.configService.get('temporal.host');
    const temporalNamespace = this.configService.get('temporal.namespace');
    const connection = await Connection.connect({
      address: temporalHost,
      connectTimeout: 10000,
    });
    this.client = new Client({
      connection,
      namespace: temporalNamespace,
    });
    this.logger.debug('Temporal client is running!');
  }

  async onModuleDestroy() {
    if (this.client) {
      this.client.connection.close();
    }
  }
}
