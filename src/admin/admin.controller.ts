/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Controller, Post, Body, UseGuards, Get, Req, Param, Patch } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const admin = await this.adminService.findByEmail(body.email);
    await this.authService.validateUser(admin, body.password);
    return this.authService.login(admin);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllAdmins() {
    return this.adminService.findAllAdmins();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getAdminById(@Param('id') id: string) {
    return this.adminService.findAdminById(id);
  }

  // ✅ Step 4: Disable Admin
  @UseGuards(JwtAuthGuard)
  @Post(':id/disable')
  disableAdmin(@Param('id') id: string) {
    return this.adminService.disableAdmin(id);
  }

  // ✅ Step 4: Enable Admin
  @UseGuards(JwtAuthGuard)
  @Post(':id/enable')
  enableAdmin(@Param('id') id: string) {
    return this.adminService.enableAdmin(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateAdmin(
  @Param('id') id: string,
  @Body() body: { name?: string; email?: string; password?: string },
) {
  return this.adminService.updateAdmin(id, body);
}
}
