import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {
    console.log('REDIS_HOST:', this.configService.get('REDIS_HOST'));
    console.log('REDIS_PORT:', this.configService.get('REDIS_PORT'));
  }
  getHello(): string {
    return 'Hello World!';
  }
}
