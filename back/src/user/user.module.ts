import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '30d' },
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
