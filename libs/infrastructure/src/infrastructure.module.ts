import { Module } from '@nestjs/common';
import { HealthModule } from './api/http/health/health.module';
import { ConfigModule } from './config/config.module';
import { AuthModule } from './di/auth/auth.module';
import { ProductsModule } from './di/products/products.module';
import { RecommendationsModule } from './di/recommendations/recommendations.module';
import { PersistenceModule } from './persistence/persistence.module';

@Module({
  providers: [],
  exports: [],
  imports: [
    ConfigModule,
    AuthModule,
    HealthModule,
    ProductsModule,
    RecommendationsModule,
    PersistenceModule,
  ],
})
export class InfrastructureModule {}
