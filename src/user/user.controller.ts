import { Controller, Post,Body } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserRequest, UserResponse } from '../model/user.model';
import { WebResponse } from '../model/web.model';

@Controller('/api/users')
export class UserController {
    constructor(private userService:UserService){

    }

    @Post()
    async register(
        @Body() request:RegisterUserRequest
    ):Promise<WebResponse<UserResponse>>{
        const result=await this.userService.register(request);
        console.log(result);

        return {
            data:result
        }
    }
}
