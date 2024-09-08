/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsString, IsEmail, MinLength, MaxLength, IsOptional  } from 'class-validator';

export class OnboardingDto {
    
    @IsOptional()
    @IsString()    
    marketing_objectives?: string;

    @IsOptional()
    @IsString()    
    target_audience?: string;

    @IsOptional()
    @IsString()    
    campaigns?: string;

    @IsOptional()
    @IsString()    
    social_media_business?: string;

    @IsOptional()
    @IsString()    
    info_caption?: string;

    @IsOptional()
    @IsString()    
    marketing_challenges?: string;

    @IsOptional()
    @IsString()    
    marketing_or_sales?: string;

    @IsOptional()
    @IsString()    
    dashoard_roles?: string;

    @IsOptional()
    @IsString()    
    members_dashoard?: string;

    @IsOptional()
    @IsString()    
    current_workflow?: string;

    @IsOptional()
    @IsString()    
    type_of_support?: string;

    @IsOptional()
    @IsString()    
    recommend_dashboard?: string;

    @IsOptional()
    @IsString()    
    immediate_questions?: string;

    @IsOptional()
    @IsString()    
    personalized_training?: string;

    @IsOptional()
    @IsString()    
    about_new_features?: string;

    @IsOptional()
    @IsString()    
    contact_information?:string;
}


/* eslint-disable prettier/prettier */


export class SettingDto {
    
    @IsOptional()
    @IsString()    
    firstname?: string;

    @IsOptional()
    @IsString()    
    lastname?: string;

    @IsOptional()
    @IsEmail()    
    @IsString()    
    email?: string;

    @IsOptional()
    @IsString()    
    username?: string;

    @IsOptional()
    @IsString()    
    location?: string;

   
}