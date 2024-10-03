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
import { CreateAddressDto } from './dto/create-address.dto';
import { Address } from './entities/address.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import * as AWS from 'aws-sdk';

@Injectable()
export class UserService {

  private s3: AWS.S3;
  private bucketName: string;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    // @InjectRepository(MailService)
    private readonly emailservice: MailService,

    @InjectRepository(ProfileImage)
    private readonly profileImageRepository: Repository<ProfileImage>,

     @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,

    // @InjectRepository(ProfileImage) private profileImageRepository: Repository<ProfileImage>,
    
  ) {
    this.s3 = new AWS.S3({
      endpoint: process.env.LINODE_BUCKET_ENDPOINT,
      accessKeyId: process.env.LINODE_ACCESS_KEY,
      secretAccessKey: process.env.LINODE_SECRET_KEY,
      region: process.env.LINODE_BUCKET_REGION,
      s3ForcePathStyle: true,
    });
    this.bucketName = process.env.LINODE_BUCKET_NAME;
  }

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
      // console.error('User creation failed', error);
      // console.error('User creation failed', error);
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
      // console.error('User login failed', error);
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
    // console.log('Changing password for token:', tokenNum);

    const userValidate = await this.userRepository.findOne({
      where: { rememberToken: tokenNum },
    });

    if (!userValidate || tokenNum == undefined || tokenNum == null || tokenNum == '') {
      throw new UnauthorizedException('The tokens are incorrect!');
    }

    // console.log('User found for password change:', userValidate);

    userValidate.password = await this.hashPassword(newPassword);
    userValidate.rememberToken = ''; // Clear token after successful password change
    await this.userRepository.save(userValidate);

    // console.log('Password changed and token cleared for user:', userValidate);
    return userValidate;
  }

  async findOne(id) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: [
        'profile_image',
        'products',
        'orders',
        'address',
      ],
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

  async updateUser(id, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update the user entity with new data
    Object.assign(user, updateUserDto);

    // Save the updated user entity
    return await this.userRepository.save(user);
  }

  async uploadFileToLinode(file: Express.Multer.File): Promise<string> {
    const params = {
      Bucket: this.bucketName,
      Key: `${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const uploadResult = await this.s3.upload(params).promise();
      return uploadResult.Location;
    } catch (error) {
      throw new BadRequestException('Error uploading file to Linode Object Storage');
    }
  }

  // Patch request to update user's profile image
  async patchUserProfileImage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<User> {
    // Find the user by ID
    const user = await this.userRepository.findOne({ where: { id: userId }, relations: { profile_image: true } });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Upload new file if provided
    let newProfileImage: ProfileImage;
    if (file) {
      const fileUrl = await this.uploadFileToLinode(file);
      newProfileImage = this.profileImageRepository.create({
        name: file.originalname,
        url: fileUrl,
        ext: path.extname(file.originalname).slice(1),
      });

      // Save the new profile image
      newProfileImage = await this.profileImageRepository.save(newProfileImage);
    }

    // If user already has an image, delete the old one from S3 and database
    if (user.profile_image) {
      try {
        const deleteParams = {
          Bucket: this.bucketName,
          Key: path.basename(user.profile_image.url),
        };
        await this.s3.deleteObject(deleteParams).promise();
      } catch (error) {
        console.error(`Error deleting old image from Linode: ${error.message}`);
      }

      // Delete old profile image from the database
      await this.profileImageRepository.delete(user.profile_image.id);
    }

    // Assign new profile image to user
    if (newProfileImage) {
      user.profile_image = newProfileImage;
    }

    // Save and return updated user
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

  async createAddress(createAddressDto: CreateAddressDto, userId) {
    // Find the user by ID to associate the address with
    const user = await this.userRepository.findOne({ where: { id: userId } });
  
    if (!user) {
      throw new Error('User not found'); // Handle the case when the user does not exist
    }
  
    // Check if an address already exists for this user
    let address = await this.addressRepository.findOne({ where: { user } });
  
    if (address) {
      // Update the existing address
      Object.assign(address, createAddressDto); // Update fields from DTO
    } else {
      // Create a new address entity
      address = this.addressRepository.create({
        ...createAddressDto,
        user, // Associate the user with the address
      });
    }
  
    // Save the address entity to the database (this will save either the new or updated address)
    return await this.addressRepository.save(address);
  }
  
}
