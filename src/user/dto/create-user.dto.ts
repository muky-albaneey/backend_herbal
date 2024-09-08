/* eslint-disable prettier/prettier */

// import { IsNotEmpty, IsString, IsEmail, MinLength, MaxLength, IsOptional  } from 'class-validator';

import { IsOptional, IsString, IsNotEmpty, IsEmail, MinLength, MaxLength, IsArray } from 'class-validator';

export class CreateAuthDto {
    
    @IsOptional()
    @IsString()    
    full_name: string;

    @IsNotEmpty({ message: "The email field is empty" })
    @IsEmail()
    @IsString()    
    email: string;
   
    @IsNotEmpty({ message: "The password field is empty" })
    @MinLength(6, { message: "The password should exceed 5 characters" })
    @MaxLength(14, { message: "The password should not exceed 14 characters" })     
    @IsString()  
    password: string;

    @IsOptional()
    @IsString() 
    rememberToken?: string;

    @IsOptional()
    @IsString()     
    country?: string;
   
    @IsOptional()
    @IsString()  
    state?: string;

 
}


export class LoginAuthDto {
   
    @IsNotEmpty({message : "The password field is empty"})
    @MinLength(6, {message : "The password should exceed 5"})
    @MaxLength(14, {message : "The password should not exceed 14"})     
    @IsString()  
    password : string
}


export class ForgotPass{
    @IsNotEmpty({message : "The email field is empty "})
    @IsEmail()
    @IsString()    
    email: string
}