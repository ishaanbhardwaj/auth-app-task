import { Controller, Post, Body, Res, HttpStatus, ValidationPipe, Get, UseGuards, Req } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './dto/auth.dto';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}

  private setCookie(res: Response, token: string) {
    res.cookie('token', token, {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
      path: '/',
    });
  }

  @Post('signup')
  async signUp(
    @Body(ValidationPipe) signUpDto: SignUpDto,
    @Res({ passthrough: true }) res: Response
  ) {
    try {
      const { token } = await this.authService.signUp(signUpDto);
      this.setCookie(res, token);
      
      return res.status(HttpStatus.CREATED).json({
        message: 'User created successfully'
      });
    } catch (error) {
      if (error.message === 'Email already exists') {
        return res.status(HttpStatus.CONFLICT).json({
          statusCode: HttpStatus.CONFLICT,
          message: 'Email already exists',
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Internal server error',
      });
    }
  }

  @Post('signin')
  async signIn(
    @Body(ValidationPipe) signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { token } = await this.authService.signIn(signInDto);
    this.setCookie(res, token);
    
    return {
      message: 'Logged in successfully'
    };
  }

  @Post('signout')
  async signOut(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'strict',
      path: '/',
    });
    
    return {
      message: 'Logged out successfully'
    };
  }

  @Get('check')
  @UseGuards(JwtAuthGuard)
  async checkAuth() {
    return { isAuthenticated: true };
  }

  @Get('name')
  @UseGuards(JwtAuthGuard)
  async getUserName(@Req() req) {
    return this.authService.getUserName(req.user.userId);
  }
}