import { Module, Global } from '@nestjs/common';
import { ServiceManager } from './manager.service';

@Global()
@Module({
  providers: [ServiceManager],
  exports: [ServiceManager],
})
export class DiscoveryClientModule {}
