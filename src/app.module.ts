import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService,  } from '@nestjs/config';
import { User } from './user/entities/user.entity';
import { MailService } from './mail/mail.service';
import { Onboarding } from './user/entities/onoard.entity';
import { ProfileImage } from './user/entities/profile.entity';
import { Settings } from './user/entities/setting.entity';
import { ResponseEntity } from './user/entities/response.entity';
import { PromptEntity } from './user/entities/reponse_prompt.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal : true
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // host:  configService.get<string>('DATABASE_DEV_HOST'),
        host: configService.get<string>('DATABASE_HOST'),
        port: configService.get<number>('DATABASE_PORT'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
        entities: [User, Onboarding, ProfileImage, ProfileImage, Settings, ResponseEntity, PromptEntity],
        synchronize: false,
        migrations: ['src/migrations/*.ts'],
      }),
    }),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService, MailService],
})
export class AppModule {}