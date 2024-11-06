import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignUpDto, SignInDto } from './dto/auth.dto';
import { User } from './interfaces/user.interface'
import { Logger } from 'nestjs-pino';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly logger: Logger
  ) {}

  private createToken(user: User) {
    return this.jwtService.sign(
      { email: user.email, sub: user._id },
      { expiresIn: '24h' }
    );
  }

  async signUp(signUpDto: SignUpDto): Promise<{ token: string }> {
    const { email, name, password } = signUpDto;

    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      this.logger.warn(`Signup attempt with existing email: ${email}`);
      throw new UnauthorizedException('Email already exists');
    }

    const newUser = new this.userModel({ email, name, password });
    await newUser.save();

    const token = this.createToken(newUser);
    this.logger.log(`User signed up successfully: ${email}`);
    return { token };
  }

  async signIn(signInDto: SignInDto): Promise<{ token: string }> {
    const { email, password } = signInDto;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      this.logger.warn(`Signin attempt with non-existent email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Signin attempt with invalid password for email: ${email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.createToken(user);
    this.logger.log(`User signed in successfully: ${email}`);
    return { token };
  }

  async getUserName(userId: string): Promise<{ name: string }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      this.logger.warn(`User not found with ID: ${userId}`);
      throw new UnauthorizedException('User not found');
    }
    
    return { name: user.name };
  }
}