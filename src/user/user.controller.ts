import { Controller, Get, Post, Body, Patch, Param, UseInterceptors,UploadedFile, Res, ParseUUIDPipe, HttpStatus, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateAuthDto, ForgotPass, LoginAuthDto,  } from './dto/create-user.dto';
// import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService, private readonly configService: ConfigService, private readonly jwt: JwtService,) {}

  @Post('create')
  async create(@Body() createAuthDto: CreateAuthDto, @Res({ passthrough: true }) response: Response): Promise<any> {
    if(createAuthDto.password == createAuthDto.confirmPassword)  {
    try {      
     
      const result = await this.userService.create(createAuthDto);
     
      const  email =  result.user.email
      const  id =  result.user.id
      const  role =  result.user.role
      const payload = { email: email, sub: id };
      const rolePayload = { role: role, sub: id };

      // Sign JWT for access token with a longer expiry time
      const jwtTokenKeys = await this.jwt.signAsync(payload, {
        expiresIn: '1d',
        secret: this.configService.get<string>('ACCESS_TOKEN'),   
      });

      // Sign JWT for refresh token with a longer expiry time
      const jwtRefreshTokenKeys = await this.jwt.signAsync(payload, {
        expiresIn: '7d',  
        secret: this.configService.get<string>('REFRESH_TOKEN'),   
      });

        // Sign JWT for role token with a longer expiry time
        const roleToken = await this.jwt.signAsync(rolePayload, {
          expiresIn: '7d',
          secret: this.configService.get<string>('ROLE_TOKEN'),   
        });

        // Set HttpOnly cookie for the access token
      response.cookie('accessToken', jwtTokenKeys, {
        httpOnly: true,
        secure: true,
        maxAge:  7 * 24 * 60 * 60 * 1000,  // 7 hours in milliseconds
        path: '/',
        sameSite: 'none',
      });

      // Set HttpOnly cookie fo2r the refresh token (if needed)
      response.cookie('refreshToken', jwtRefreshTokenKeys, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        path: '/', 
        sameSite: 'none',
      });

      // Set HttpOnly cookie for the role token (if needed)
      response.cookie('roleToken', roleToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        path: '/', 
        sameSite: 'none',
      });
        return response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'User created successfully',
        jwtTokens: jwtTokenKeys,
        roleToken: roleToken,
      });
    } catch (error) {
      console.error('User creation failed', error);
      throw error;
    }
    }else{
      return null
    }
  }

  @Post('login')
async login(@Body() createAuthDto: LoginAuthDto, @Res({ passthrough: true }) response: Response): Promise<any> {
  try {
    const result = await this.userService.login(createAuthDto);
    const { email, id, role } = result;
    const payload = { email: email, sub: id };
    const rolePayload = { role: role, sub: id };

    // Sign JWT for access token
    const jwtTokenKeys = await this.jwt.signAsync(payload, {
      expiresIn: '1d',
      secret: this.configService.get<string>('ACCESS_TOKEN'),   
    });

    // Sign JWT for refresh token
    const jwtRefreshTokenKeys = await this.jwt.signAsync(payload, {
      expiresIn: '7d',
      secret: this.configService.get<string>('REFRESH_TOKEN'),   
    });

    // Sign JWT for role token
    const roleToken = await this.jwt.signAsync(rolePayload, {
      expiresIn: '7d',
      secret: this.configService.get<string>('ROLE_TOKEN'),   
    });

    // Set HttpOnly cookie for access token
    response.cookie('accessToken', jwtTokenKeys, {
      httpOnly: true, // Prevent client-side access to the cookie
      secure: true,   // Use secure cookies for HTTPS only
      maxAge: 24 * 60 * 60 * 1000,  // 1 day in milliseconds
      sameSite: 'none', // Allow cross-origin requests
    });

    // Set HttpOnly cookie for refresh token
    response.cookie('refreshToken', jwtRefreshTokenKeys, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      sameSite: 'none',
    });

    // Set HttpOnly cookie for role token
    response.cookie('roleToken', roleToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      sameSite: 'none',
    });

    return response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'User successfully logged in',
      jwtTokens: jwtTokenKeys,
      roleToken: roleToken,
    });
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
}


//   @Post('login')
//   async login(@Body() createAuthDto: CreateAuthDto, @Res({ passthrough: true }) response: Response): Promise<any> {
//     // console.log(createAuthDto.email)
//     // console.log(createAuthDto.password)
//   try {      
    
//     const result = await this.userService.login(createAuthDto);
//     // console.log(result)
//     const  email =  result.email
//     const  id =  result.id
//     const  role =  result.role
//     const payload = { email: email, sub: id };
//     const rolePayload = { role: role, sub: id };

//     // Sign JWT for access token with a longer expiry time
//     const jwtTokenKeys = await this.jwt.signAsync(payload, {
//       expiresIn: '1d',
//       secret: this.configService.get<string>('ACCESS_TOKEN'),   
//     });

//     // Sign JWT for refresh token with a longer expiry time
//     const jwtRefreshTokenKeys = await this.jwt.signAsync(payload, {
//       expiresIn: '7d',
//       secret: this.configService.get<string>('REFRESH_TOKEN'),   
//     });

//       // Sign JWT for role token with a longer expiry time
//       const roleToken = await this.jwt.signAsync(rolePayload, {
//         expiresIn: '7d',
//         secret: this.configService.get<string>('ROLE_TOKEN'),   
//       });

//       // Set HttpOnly cookie for the access token
//     response.cookie('accessToken', jwtTokenKeys, {
//       httpOnly: true,
//       secure: true,
//       maxAge: 7 * 12 * 60 * 60 * 1000,  // 7 hours in milliseconds
//       path: '/',
//       sameSite: 'none',
//     });

//     // Set HttpOnly cookie for the refresh token (if needed)
//     response.cookie('refreshToken', jwtRefreshTokenKeys, {
//       httpOnly: true,
//       secure: true,
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
//       path: '/', 
//       sameSite: 'none',
//     });

//     // Set HttpOnly cookie for the role token (if needed)
//     response.cookie('roleToken', roleToken, {
//       httpOnly: true,
//       secure: true,
//       maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
//       path: '/', 
//       sameSite: 'none',
//     });
//   return response.status(HttpStatus.OK).json({
//         statusCode: HttpStatus.OK,
//         message: 'User successfully login',
//         jwtTokens: jwtTokenKeys,
//         roleToken: roleToken,
//       });
//   } catch (error) {
//     console.error('User creation failed', error);
//     throw error;
//   }
// }


//LOGOUT
@Post('logout')
  async logout(@Res({ passthrough: true }) response: Response): Promise<any> {
    response.cookie('accessToken', '', {
      maxAge: 0,
    });

    response.cookie('refreshToken', '', {
      maxAge: 0,
    });

    response.cookie('roleToken', '', {
      maxAge: 0,
    });

    return { message: 'Logout successful' };
  }

// FORGOT PASSWORD SECTION

@Patch('get_tokens')
async resetPassword(@Body() userEmail: ForgotPass) {
  return this.userService.getTokens(userEmail)
}

@Get('validateTokens')
async reset(@Body() body: { token: string }) {
  console.log('Received token:', body.token);
  return this.userService.validateTokens(body.token);
}

@Patch('update_password')
  async updatePassword(@Body() body: { tokens: string; newPassword: string }) {
    await this.userService.changePassword(body.tokens, body.newPassword);
    return { message: 'Password updated successfully' };
  }

  @Get('all')
  async findAll() {
      return await this.userService.findAll();
    }

  @Get(':id/single_user')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
      return await this.userService.findOne(id);
    }
    
  @Patch(':id/profileImg')
  @UseInterceptors(FileInterceptor ('profile'))
  @UsePipes(new ValidationPipe({ transform: true }))
  async uploadProfile(@Param('id', ParseUUIDPipe) id: string, @UploadedFile() file: Express.Multer.File) {
  // async createProfileImg(@Param('id', ParseUUIDPipe) id: string, @Body() createFileDto) {  
    
    const result = await this.userService.updateProfileBg(id, file); 
    console.log(result)
    return result;
  }



}
