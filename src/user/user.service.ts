import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto, ForgotPass } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { MailService } from 'src/mail/mail.service';
import { OnboardingDto, SettingDto } from './dto/update-user.dto';
import { Onboarding } from './entities/onoard.entity';
import * as path from 'path';
import { ProfileImage } from './entities/profile.entity';
import { Settings } from './entities/setting.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Onboarding)
    private readonly onboardingRepository: Repository<Onboarding>,
    
    // @InjectRepository(MailService)
    private readonly emailservice: MailService,

    @InjectRepository(ProfileImage)
    private readonly ProfileBgRepository: Repository<ProfileImage>,

    @InjectRepository(Settings)
    private readonly SettingsRepository: Repository<Settings>
    
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

      const newUser = await this.userRepository.create(createAuthDto);
      const userSaved = await this.userRepository.save(newUser);

      return { user: userSaved };
    } catch (error) {
      console.error('User creation failed', error);
      console.error('User creation failed', error);
      throw error;
    }
  }

  async login(createAuthDto: CreateAuthDto): Promise<any> {
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


  async updateOnboarding(id, body: OnboardingDto) {
    // Find the user with the given id and their associated onboarding information
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {onboard_info: true, profile_image: true, settings: true, caption_responses: true, prompt_responses:true}  
    });
  
    console.log("User found: ", user);
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    if (user.onboard_info) {
      // Update existing onboarding entity
      user.onboard_info.marketing_objectives = body.marketing_objectives;
      user.onboard_info.target_audience = body.target_audience;
      user.onboard_info.campaigns = body.campaigns;
      user.onboard_info.social_media_business = body.social_media_business;
      user.onboard_info.info_caption = body.info_caption;
      user.onboard_info.marketing_challenges = body.marketing_challenges;
      user.onboard_info.marketing_or_sales = body.marketing_or_sales;
      user.onboard_info.dashoard_roles = body.dashoard_roles;
      user.onboard_info.members_dashoard = body.members_dashoard;
      user.onboard_info.current_workflow = body.current_workflow;
      user.onboard_info.type_of_support = body.type_of_support;
      user.onboard_info.recommend_dashboard = body.recommend_dashboard;
      user.onboard_info.immediate_questions = body.immediate_questions;
      user.onboard_info.personalized_training = body.personalized_training;
      user.onboard_info.about_new_features = body.about_new_features;
      user.onboard_info.contact_information = body.contact_information;
  
      console.log("Updating existing onboarding info: ", user.onboard_info);
      await this.onboardingRepository.save(user.onboard_info);
    } else {
      // Create new onboarding entity
      const newonboarding = this.onboardingRepository.create(body);
  
      console.log("Creating new onboarding info: ", newonboarding);
      user.onboard_info = await this.onboardingRepository.save(newonboarding);
    }
  
    // Save the updated user entity with new or updated onboarding info
    
    console.log("User updated successfully: ", user);
    return await this.userRepository.save(user);
  }

  async updateSetting(id, body: SettingDto) {
    // Find the user with the given id and their associated onboarding information
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {onboard_info: true, profile_image: true, settings: true, caption_responses: true, prompt_responses:true}  
     });
  
    console.log("User found: ", user);
  
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    if (user.settings) {
      console.log(user.settings.firstname );
      
      // Update existing onboarding entity
      if(body.firstname !== "") user.settings.firstname = body?.firstname 
      else user.settings.firstname = user.settings.firstname;

      if(body.lastname !== "") user.settings.lastname = body?.lastname
      else user.settings.lastname = user.settings.lastname;

      if(body.email !== "") user.settings.email = body?.email;
      else user.settings.email = user.settings.email;

      if(body.username !== "") user.settings.username = body?.username;
      else user.settings.username  = user.settings.username;

      if(body.location !== "") user.settings.location = body?.location;
      else user.settings.location = user.settings.location;

      // user.settings.lastname = body?.lastname;
      // user.settings.email = body?.email;
      // user.settings.username = body?.username;
      // user.settings.location = body?.location;
      
      console.log("Updating existing profile info: ", user.settings);
      await this.SettingsRepository.save(user.settings);
    } else {
      // Create new onboarding entity
      const newsettings = this.SettingsRepository.create(body);
  
      console.log("Creating new onboarding info: ", newsettings);
      user.settings = await this.SettingsRepository.save(newsettings);
    }
  
    // Save the updated user entity with new or updated onboarding info
    
    console.log("User updated successfully: ", user);
    return await this.userRepository.save(user);
  }
  async findOne(id){
    // const user = await this.userRepository.findOne({
    //   where: { id },
    //   relations: ['onboard_info'],
      
    // });
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {onboard_info: true, profile_image: true, settings: true, caption_responses: true, prompt_responses:true}      // relations: {profile_bg: true, profile_image : true},
    });
    
    console.log("User found: ", user);
  
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
  
  async findAll() {
    const user = await this.userRepository.find({      
      relations: {onboard_info: true, profile_image: true, settings: true, caption_responses: true, prompt_responses:true}  
    });
    return user
  }

  
  async updateProfileBg(id, image: { originalname: string, buffer: Buffer }): Promise<User> {
    // Check if the user exists    
    const user = await this.userRepository.findOne({
      where: { id },
      relations: {onboard_info: true, profile_image: true, settings: true, caption_responses: true, prompt_responses:true}  
      // relations: {profile_bg: true, profile_image : true},
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
      user.profile_image.content = image.buffer;
      user.profile_image.ext = path.extname(image.originalname).toLowerCase().slice(1).trim();
      user.profile_image.base64 = image.buffer.toString('base64');
  
      // Save the updated profile background entity to the database
      await this.ProfileBgRepository.save(user.profile_image);
    } else {
      // Create new profile background entity
      const newProfileBg = new ProfileImage({
        name: image.originalname,
        content: image.buffer,
        ext: path.extname(image.originalname).toLowerCase().slice(1).trim(),
        base64: image.buffer.toString('base64'),
      });
  
      // Save the new profile background entity to the database
      user.profile_image = await this.ProfileBgRepository.save(newProfileBg);
    }
  
    // Save the updated user entity to the database
    return await this.userRepository.save(user);
  }
}
