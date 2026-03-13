import { Global, Module } from "@nestjs/common";
import { PrismaService } from "./postgres/prisma.service";

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class DatabaseModule {}
