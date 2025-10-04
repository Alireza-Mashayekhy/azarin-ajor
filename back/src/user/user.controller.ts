import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { JwtAuthGuard } from '../common/jwt-auth.guard';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  // Admin: list all users with pagination and search
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/users')
  listUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.userService.listAllUsers(pageNum, limitNum, search);
  }

  // Login/Register via OTP (single endpoint)
  @Post('auth/otp')
  loginOrRegister(@Body() dto: { phone: string; code?: string }) {
    console.log(dto);
    return this.userService.loginOrRegister(dto.phone, dto.code);
  }
}
