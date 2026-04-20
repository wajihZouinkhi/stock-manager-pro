import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      user: { findUnique: jest.fn(), create: jest.fn(), count: jest.fn().mockResolvedValue(0) },
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: { sign: () => 'fake.jwt.token' } },
      ],
    }).compile();
    service = moduleRef.get(AuthService);
  });

  it('registers first user as ADMIN', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue({ id: 1, email: 'a@b.c', name: 'A', role: 'ADMIN', createdAt: new Date() });
    const r = await service.register({ email: 'a@b.c', password: 'password123', name: 'A' });
    expect(r.token).toBe('fake.jwt.token');
    expect(r.user.role).toBe('ADMIN');
  });

  it('rejects duplicate email', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: 1 });
    await expect(service.register({ email: 'a@b.c', password: 'password123', name: 'A' })).rejects.toThrow();
  });
});
