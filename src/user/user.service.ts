import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import { RegisterUserRequest, UserResponse } from '../model/user.model';
import {Logger} from 'winston';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        private validationService:ValidationService,
        @Inject(WINSTON_MODULE_PROVIDER) private logger:Logger,
        private prismaServicve:PrismaService
    ){

    }
    async register(request:RegisterUserRequest):Promise<UserResponse>{
        this.logger.info(`Register new user ${JSON.stringify(request)}`);
        const registerRequest=this.validationService.validate(UserValidation.REGISTER, request);

        const totalUserWithSameUsername=await this.prismaServicve.user.count({
            where:{
                username:registerRequest.username
            }
        });

        if(totalUserWithSameUsername != 0){
            throw new HttpException('Username already exists',400);
        }

        registerRequest.password = await bcrypt.hash(registerRequest.password,10);

        const user=await this.prismaServicve.user.create({
            data:registerRequest
        });
        

        return {
            username:user.username,
            name:user.name
        };
    }
}
