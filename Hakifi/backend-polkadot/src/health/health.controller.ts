import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { PrismaService } from 'nestjs-prisma';

@Controller('health')
export class HealthController {
  constructor(
    private readonly healthService: HealthCheckService,
    private readonly http: HttpHealthIndicator,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly prismaService: PrismaService,
  ) {}

  @Get()
  @HealthCheck()
  health() {
    return this.healthService.check([
      () => this.http.pingCheck('google', 'https://google.com'),
      () => this.http.pingCheck('bscscan', 'https://bscscan.com/'),
      () => this.prismaHealth.pingCheck('database', this.prismaService),
    ]);
  }
}
