import { Module } from '@nestjs/common';
import { HealthModule } from './api/http/health/health.module';
import { HttpModule } from './api/http/http.module';
import { ConfigModule } from './config/config.module';

@Module({
  providers: [],
  exports: [],
  imports: [ConfigModule, HttpModule, HealthModule],
})
export class InfrastructureModule {}
