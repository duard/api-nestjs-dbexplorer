import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SqlServerService } from './database/sqlserver.service';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { InspectionModule } from './modules/inspection/inspection.module';
import { PortoesModule } from './modules/sankhya/portoes/portoes.module';
import { TsiUsuModule } from './modules/sankhya/tsiusu/tsiusu.module';
import { VersionModule } from './modules/version/version.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    HealthModule,
    VersionModule,
    InspectionModule,
    TsiUsuModule,
    PortoesModule,
  ],
  controllers: [AppController],
  providers: [AppService, SqlServerService],
})
export class AppModule {}
