import { NestFactory } from '@nestjs/core';
import { ApigatewayModule } from './apigateway.module';

async function bootstrap() {
  const app = await NestFactory.create(ApigatewayModule);
  await app.listen(3000);
}
bootstrap();
