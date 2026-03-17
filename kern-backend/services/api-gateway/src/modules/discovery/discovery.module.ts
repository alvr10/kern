import { Module, Global } from '@nestjs/common';
import { DiscoveryController } from './discovery.controller';
import { RegistryService } from './registry.service';

@Global()
@Module({
  controllers: [DiscoveryController],
  providers: [RegistryService],
  exports: [RegistryService],
})
export class DiscoveryModule {}
