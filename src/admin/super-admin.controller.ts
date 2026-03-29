import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('super-admin')
export class SuperAdminController {
  constructor(private readonly adminService: AdminService) {}

  @UseGuards(JwtAuthGuard) // only authentication, no role guard
  @Post('create-admin')
  async createAdmin(
    @Body() body: { name: string; email: string; password: string },
  ) {
    return this.adminService.createAdmin(body);
  }
}
