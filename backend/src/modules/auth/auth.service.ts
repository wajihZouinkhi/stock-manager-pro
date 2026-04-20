import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');
    const hash = await bcrypt.hash(dto.password, 12);
    const userCount = await this.prisma.user.count();
    const user = await this.prisma.user.create({
      data: { email: dto.email, password: hash, name: dto.name, role: userCount === 0 ? 'ADMIN' : 'STAFF' },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
    const token = this.sign(user.id, user.email, user.role);
    return { user, token };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const token = this.sign(user.id, user.email, user.role);
    const { password, ...safeUser } = user;
    return { user: safeUser, token };
  }

  async me(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }

  private sign(id: number, email: string, role: string) {
    return this.jwt.sign({ sub: id, email, role });
  }
}
