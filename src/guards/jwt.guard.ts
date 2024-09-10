/* eslint-disable prettier/prettier */
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtGuard implements CanActivate {

    constructor(private readonly jwt: JwtService, private readonly configService: ConfigService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        

        
        const token = this.extractTokenFromCookies(request);
        console.log('Before setting user property:', request);
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwt.verifyAsync(token, {
                secret: this.configService.get<string>('ROLE_TOKEN'),  
            });

            request['user'] = payload;

        } catch {
            throw new UnauthorizedException();
        }

        console.log('After setting user property:', request);

        return true;
    }

    private extractTokenFromCookies(req: Request) {
        return req.cookies?.roleToken;
    }
}
@Injectable()
export class implements CanActivate {

    constructor(private readonly jwt: JwtService, private readonly configService: ConfigService,) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromCookies(request);
    // console.log(token)
        if (!token) {
            throw new UnauthorizedException();
        }

        try {
            const payload = await this.jwt.verifyAsync(token, {
                secret: this.configService.get<string>('ROLE_TOKEN'),  
            });
            request['userId'] = payload;

        } catch {
            throw new UnauthorizedException();
        }

        return true;
    }

    private extractTokenFromCookies(req: Request) {
        // console.log(req.cookies?.roleToken)
        return req.cookies?.roleToken; // Replace 'yourCookieName' with the actual name of your cookie
    }

}
