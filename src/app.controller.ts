import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  health() {
    return {
      status: 'ok',
      uptimeSec: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
      // optionally expose version via env or package.json if you prefer
      version: process.env.APP_VERSION || 'dev',
    };
  }

  @Get('health/live')
  live() {
    // if the process is running, we’re “live”
    return { status: 'ok' };
  }
}
