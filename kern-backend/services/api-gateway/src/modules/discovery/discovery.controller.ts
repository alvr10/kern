import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { RegistryService, ServiceInstance } from './registry.service';

@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly registry: RegistryService) {}

  @Post('register')
  register(@Body() instance: Omit<ServiceInstance, 'status' | 'lastHeartbeat'>) {
    this.registry.register(instance);
    return { status: 'OK' };
  }

  @Delete('register/:id')
  deregister(@Param('id') id: string) {
    this.registry.deregister(id);
    return { status: 'OK' };
  }

  @Get('services')
  getAll() {
     return this.registry.getAll();
  }

  @Get('services/:name')
  getByName(@Param('name') name: string) {
    return this.registry.getByName(name);
  }
}
