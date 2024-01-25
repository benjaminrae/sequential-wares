import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [HealthModule, AuthModule],
  controllers: [],
})
export class HttpModule {}
