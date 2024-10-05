/* eslint-disable prettier/prettier */

// import { IsNotEmpty, IsString, IsEmail, MinLength, MaxLength, IsOptional  } from 'class-validator';

import { IsOptional, IsString, IsNotEmpty, IsEmail, MinLength, MaxLength, IsArray, IsPhoneNumber } from 'class-validator';

export class CreateAuthDto {
    
    @IsOptional()
    @IsString()    
    full_name?: string;

    @IsNotEmpty({ message: "The email field is empty" })
    @IsEmail()
    @IsString()    
    email: string;


    @IsOptional()
    @IsPhoneNumber()
    @IsString()    
    phone_num?: string;
   
   
    @IsNotEmpty({ message: "The password field is empty" })
    @MinLength(6, { message: "The password should exceed 5 characters" })
    @MaxLength(14, { message: "The password should not exceed 14 characters" })     
    @IsString()  
    password?: string;

    @IsNotEmpty({ message: "The password field is empty" })
    @MinLength(6, { message: "The password should exceed 5 characters" })
    @MaxLength(14, { message: "The password should not exceed 14 characters" })     
    @IsString()  
    confirmPassword?: string;


    @IsOptional()
    @IsString() 
    rememberToken?: string;

    @IsOptional()
    @IsString()     
    location?: string;

 
}


export class LoginAuthDto {
    @IsNotEmpty({ message: "The email field is empty" })
    @IsEmail()
    @IsString()    
    email: string;

    
    @IsNotEmpty({message : "The password field is empty"})
    @MinLength(6, {message : "The password should exceed 5"})
    @MaxLength(14, {message : "The password should not exceed 14"})     
    @IsString()  
    password: string
}


export class ForgotPass{
    @IsNotEmpty({message : "The email field is empty "})
    @IsEmail()
    @IsString()    
    email: string
}