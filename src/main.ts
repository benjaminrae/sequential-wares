import { InfrastructureModule } from '@app/infrastructure';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(InfrastructureModule);

  const configService = app.get(ConfigService);
  const port = configService.get('port');

  await app.listen(port);
}
bootstrap();
