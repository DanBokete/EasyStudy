import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
// import { PrismaNeon } from '@prisma/adapter-neon';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // constructor() {
  //   const connectionString = process.env.DATABASE_URL as string;
  //   const adapter = new PrismaNeon({ connectionString });

  //   // Call PrismaClient constructor with the adapter
  //   super({ adapter });
  // }
  async onModuleInit() {
    await this.$connect();
  }
}
