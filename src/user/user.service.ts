import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto, ForgotPass, LoginAuthDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
// import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import * as path from 'path';
import { ProfileImage } from './entities/profile.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // @InjectRepository(MailService)
    private readonly emailservice: MailService,

    @InjectRepository(ProfileImage)
    private readonly ProfileBgRepository: Repository<ProfileImage>,

    
  ) {}

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async create(createAuthDto: CreateAuthDto): Promise<any> {
    try {
      const userValidate = await this.userRepository.findOne({
        where: { email: createAuthDto.email },
      });

      if (userValidate) {
        throw new UnauthorizedException('The user already exists!');
      }

      // Hash the password before saving
      createAuthDto.password = await this.hashPassword(createAuthDto.password);

      const { confirmPassword, ...userData } = createAuthDto;

      const newUser = await this.userRepository.create(userData);
      const userSaved = await this.userRepository.save(newUser);

      return { user: userSaved };
    } catch (error) {
      console.error('User creation failed', error);
      console.error('User creation failed', error);
      throw error;
    }
  }

  async login(createAuthDto: LoginAuthDto): Promise<any> {
    try {
      const userValidate = await this.userRepository.findOne({
        where: { email: createAuthDto.email },
      });

      if (!userValidate) {
        throw new UnauthorizedException('The user does not exist!');
      }

      const isMatch = await bcrypt.compare(createAuthDto.password, userValidate.password);
      if (!isMatch) {
        throw new UnauthorizedException('The password does not match!');
      }

      return userValidate;
    } catch (error) {
      console.error('User login failed', error);
      throw error;
    }
  }

  // FORGOT PASSWORD SECTION
  async getTokens(userEmail: ForgotPass) {
    const userValidate = await this.userRepository.findOne({
      where: { email: userEmail.email },
    });

    if (!userValidate) {
      throw new UnauthorizedException('The email address does not exist!');
    }

    const token = Math.floor(10000 + Math.random() * 90000).toString();

    userValidate.rememberToken = token;
    await this.userRepository.save(userValidate);

    await this.emailservice.dispatchEmail(
      userValidate.email,
      'FORGOT PASSWORD TOKEN',
      `
      this token will be expired imediately you changed your password
      password reset token: ${token} `,
      `<h1>${userValidate.rememberToken}</h1>`
    );

    return `Message has been sent to your email, ${userValidate.full_name}`;
  }

  async validateTokens(tokenNum: string): Promise<string> {
    const userValidate = await this.userRepository.findOne({
      where: { rememberToken: tokenNum },
    });

    if (!userValidate) {
      throw new UnauthorizedException('The tokens are incorrect!');
    }

    return userValidate.rememberToken;
  }

  async changePassword(tokenNum: string, newPassword: string) {
    console.log('Changing password for token:', tokenNum);

    const userValidate = await this.userRepository.findOne({
      where: { rememberToken: tokenNum },
    });

    if (!userValidate || tokenNum == undefined || tokenNum == null || tokenNum == '') {
      throw new UnauthorizedException('The tokens are incorrect!');
    }

    console.log('User found for password change:', userValidate);

    userValidate.password = await this.hashPassword(newPassword);
    userValidate.rememberToken = ''; // Clear token after successful password change
    await this.userRepository.save(userValidate);

    console.log('Password changed and token cleared for user:', userValidate);
    return userValidate;
  }


  async findOne(id){
  
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { profile_image: true}      // relations: {profile_bg: true, profile_image : true},
    });
    
    console.log("User found: ", user);
  
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  
  async findAll() {
    const user = await this.userRepository.find({      
      relations: { profile_image: true}     });
    return user
  }

  
  async updateProfileBg(id, image: { originalname: string, buffer: Buffer }): Promise<User> {
    // Check if the user exists    
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { profile_image: true}       // relations: {profile_bg: true, profile_image : true},
    });
    
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    // Validate image file format
    if (!['.jpeg', '.png', '.gif', '.jpg', '.avif'].includes(path.extname(image.originalname).toLowerCase())) {
      throw new BadRequestException('Invalid image file format');
    }
  
    if (user.profile_image) {
      // Update existing profile background entity
      user.profile_image.name = image.originalname;
      // user.profile_image.content = image.buffer;
      user.profile_image.ext = path.extname(image.originalname).toLowerCase().slice(1).trim();
      user.profile_image.base64 = image.buffer.toString('base64');
  
      // Save the updated profile background entity to the database
      await this.ProfileBgRepository.save(user.profile_image);
    } else {
      // Create new profile background entity
      const newProfileBg = new ProfileImage({
        name: image.originalname,
        // content: image.buffer,
        ext: path.extname(image.originalname).toLowerCase().slice(1).trim(),
        base64: image.buffer.toString('base64'),
      });
  
      // Save the new profile background entity to the database
      user.profile_image = await this.ProfileBgRepository.save(newProfileBg);
    }
  
    // Save the updated user entity to the database
    return await this.userRepository.save(user);
  }

  async countUsers(): Promise<number> {
    return await this.userRepository.count();
  }

  async changeUserRole(userId, newRole: UserRole): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!Object.values(UserRole).includes(newRole)) {
      throw new BadRequestException('Invalid role');
    }

    user.role = newRole;
    return await this.userRepository.save(user);
  }
}
