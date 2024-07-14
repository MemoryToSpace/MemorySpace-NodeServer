// src/controllers/healthCheck.controller.ts
import { Controller, Get, Route } from 'tsoa';

@Route('health-check')
export class HealthCheckController extends Controller {
  /**
   * Check if the server is alive
   * @example response "Server is alive"
   */
  @Get('/')
  public async checkServer(): Promise<string> {
    return 'Server is alive';
  }
}
