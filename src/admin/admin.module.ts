import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { SuperAdminController } from './super-admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './admin.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Admin]), AuthModule],
  controllers: [AdminController, SuperAdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
