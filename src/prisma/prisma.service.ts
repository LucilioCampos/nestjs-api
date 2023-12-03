import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  private readonly logger: Logger;
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('POSTGRES_URL'),
        },
      },
    });
    this.logger = new Logger('DatabaseService');
    this.logger.log(`[Database Conected]`);
  }
}
