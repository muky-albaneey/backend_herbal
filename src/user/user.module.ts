
import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { Onboarding } from './entities/onoard.entity';
import { ProfileImage } from './entities/profile.entity';
import { Settings } from './entities/setting.entity';
import { ResponseEntity } from './entities/response.entity';
import { PromptEntity } from './entities/reponse_prompt.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Onboarding, ProfileImage, Settings, ResponseEntity, PromptEntity]),
    ConfigModule, // Ensure ConfigModule is imported
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('ACCESS_TOKEN'),
        signOptions: { expiresIn: '60s' },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule],
  controllers: [UserController],
  providers: [JwtService, UserService, MailService],
})
export class UserModule {}
