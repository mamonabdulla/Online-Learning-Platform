/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepo: Repository<Admin>,
  ) {}

  // ✅ Login-safe find
  async findByEmail(email: string): Promise<Admin> {
    const admin = await this.adminRepo.findOne({ where: { email } });
    if (!admin) throw new NotFoundException('Admin not found');

    if (!admin.isActive) {
      throw new ForbiddenException('Admin account is disabled'); // ✅ prevent login if disabled
    }

    return admin;
  }

  async createAdmin(
    data: { name: string; email: string; password: string },
    ): Promise<Admin> {
    const exists = await this.adminRepo.findOne({ where: { email: data.email } });
    if (exists) throw new ConflictException('Admin already exists');

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const admin = this.adminRepo.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: 'admin',
      isActive: true, // ✅ new admin is active by default
    });

    return this.adminRepo.save(admin);
  }

  async findAdminById(id: string) {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');
    return admin;
  }

  async findAllAdmins() {
    return this.adminRepo.find({
      select: ['id', 'name', 'email', 'role', 'isActive'], // ✅ include isActive
    });
  }

  async disableAdmin(id: string) {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');
    admin.isActive = false;
    return this.adminRepo.save(admin);
  }

  async enableAdmin(id: string) {
    const admin = await this.adminRepo.findOne({ where: { id } });
    if (!admin) throw new NotFoundException('Admin not found');
    admin.isActive = true;
    return this.adminRepo.save(admin);
  }

  async updateAdmin(
  id: string,
  data: { name?: string; email?: string; password?: string },
) {
  const admin = await this.adminRepo.findOne({ where: { id } });
  if (!admin) throw new NotFoundException('Admin not found');

  // Update email safely
  if (data.email && data.email !== admin.email) {
    const exists = await this.adminRepo.findOne({ where: { email: data.email } });
    if (exists) throw new ConflictException('Email already in use');
    admin.email = data.email;
  }

  if (data.name) admin.name = data.name;

  if (data.password) {
    const hashed = await bcrypt.hash(data.password, 10);
    admin.password = hashed;
  }

  return this.adminRepo.save(admin);
}
}
