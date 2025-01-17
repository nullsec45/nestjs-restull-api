import { Controller, 
         Post,
         Body,
         Get,
         Inject,
         Patch,
         HttpCode,
         Delete
        } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserRequest, UpdateUserRequest, UserResponse } from '../model/user.model';
import { WebResponse } from '../model/web.model';
import { Auth } from '../common/auth.decorator';
import { User } from '@prisma/client';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import {Logger} from 'winston';
import { request } from 'http';


@Controller('/api/users')
export class UserController {
    constructor(private userService:UserService, @Inject(WINSTON_MODULE_PROVIDER) private logger:Logger,){

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
    @HttpCode(200)
    async login(
        @Body() request:RegisterUserRequest
    ):Promise<WebResponse<UserResponse>>{
        const result=await this.userService.login(request);

        return {
            data:result
        }
    }

    @Get('/current')
    @HttpCode(200)
    async get(
        @Auth() user:User
    ):Promise<WebResponse<UserResponse>>{
        const result=await this.userService.get(user);

        return {
            data:result
        }
    }

    @Patch('/current')
    @HttpCode(200)
    async update(
        @Auth() user:User,
        @Body() request:UpdateUserRequest
    ):Promise<WebResponse<UserResponse>>{
        const result=await this.userService.update(user,request);

        return {
            data:result
        }
    }

    @Delete('/current')
    @HttpCode(200)
    async logout(@Auth() user:User) : Promise<WebResponse<boolean>>{
        await this.userService.logout(user);

        return {
            data:true
        }
    }
}
