import { InfrastructureModule } from '@app/infrastructure';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(InfrastructureModule);
  await app.listen(3000);
}
bootstrap();
