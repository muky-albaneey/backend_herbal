import { IsString, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  full_name?: string;

  @IsString()
  @IsOptional()
  phone_num?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
