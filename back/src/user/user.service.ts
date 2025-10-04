import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async listAllUsers(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;

    // Build search conditions
    const searchConditions = search
      ? {
          OR: [
            // Search by ID if search term is numeric and within INT4 range
            ...(isNaN(Number(search)) ||
            Number(search) > 2147483647 ||
            Number(search) < 1
              ? []
              : [{ id: Number(search) }]),
            // Search by text fields
            { email: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search, mode: 'insensitive' as const } },
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            // Search by role enum (exact match)
            ...(search.toUpperCase() === 'USER' ||
            search.toUpperCase() === 'ADMIN'
              ? [{ role: search.toUpperCase() as any }]
              : []),
          ],
        }
      : {};

    // Get total count for pagination
    const total = await this.prisma.user.count({
      where: searchConditions,
    });

    // Get users with pagination and search
    const users = await this.prisma.user.findMany({
      where: searchConditions,
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
      orderBy: { id: 'desc' },
      skip,
      take: limit,
    });

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    };
  }

  async loginOrRegister(phone: string, code?: string) {
    // naive OTP: fixed '11111' for now
    const OTP = '11111';
    console.log(code);
    if (!code) {
      // issue otp step (mock)
      throw new ForbiddenException('کد تایید نادرست است');
    }
    if (code !== OTP) {
      throw new ForbiddenException('کد تایید نادرست است');
    }
    const user = await this.prisma.user.upsert({
      where: { phone },
      update: {},
      create: { phone },
    });
    const token = await this.jwt.signAsync({ sub: user.id, role: user.role });
    return {
      ok: true,
      token,
      tokenType: 'Bearer',
      user: { id: user.id, phone: user.phone, role: user.role },
    };
  }
}
