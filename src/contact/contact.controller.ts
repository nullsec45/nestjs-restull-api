import { Controller,Post,HttpCode,Body} from "@nestjs/common";
import { ContactService } from "./contact.service";
import { Auth } from "../common/auth.decorator";
import { User } from "@prisma/client";
import { CreateContactRequest } from "../model/contact.model";

@Controller('/api/contacts')
export class ContactController{
    constructor(
        private contactService:ContactService
    ){}

    @Post()
    async create(
        @Auth() user:User,
        @Body() request:CreateContactRequest
    ){
        const result= await this.contactService.create(user,request);
        return {
            data:result
        }
    }
}

