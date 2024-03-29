import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './auth.guard';
import { StatusOk } from 'src/types';
import { SignupDto, SigninDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signup')
  signup(@Body() dto: SignupDto): Promise<StatusOk> {
    return this.authService.signup(dto);
  }

  @Public()
  @Post('signin')
  signin(@Body() dto: SigninDto): Promise<StatusOk> {
    return this.authService.signin(dto);
  }
}
