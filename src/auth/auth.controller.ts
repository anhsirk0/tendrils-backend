import { Body, Controller, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { StatusOk } from 'src/types';
import { SignupDto, SigninDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto): Promise<StatusOk> {
    return this.authService.signup(dto);
  }

  @Post('signin')
  signin(@Body() dto: SigninDto): Promise<StatusOk> {
    return this.authService.signin(dto);
  }
}
