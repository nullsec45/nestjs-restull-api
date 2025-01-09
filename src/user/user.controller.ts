import { Controller, Post,Body, Get,Inject } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserRequest, UserResponse } from '../model/user.model';
import { WebResponse } from '../model/web.model';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {Logger} from 'winston';


@Controller('/api/users')
export class UserController {
    constructor(private userService:UserService,    @Inject(WINSTON_MODULE_PROVIDER) private logger:Logger,){

    }

    @Post()
    async register(
        @Body() request:RegisterUserRequest
    ):Promise<WebResponse<UserResponse>>{
        const result=await this.userService.register(request);

        return {
            data:result
        }
    }

    @Post('/login')
    async login(
        @Body() request:RegisterUserRequest
    ):Promise<WebResponse<UserResponse>>{
        const result=await this.userService.login(request);

        return {
            data:result
        }
    }

    @Get('/current')
    async get(
        @Auth() user:User
    ):Promise<WebResponse<UserResponse>>{
        const result=await this.userService.get(user);

        return {
            data:result
        }
    }

}
