import { Controller,Post,HttpCode,Body, ParseIntPipe,Get,Param} from "@nestjs/common";
import { ContactService } from "./contact.service";
import { Auth } from "../common/auth.decorator";
import { User } from "@prisma/client";
import { ContactResponse, CreateContactRequest } from "../model/contact.model";
import { WebResponse } from "src/model/web.model";

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

    @Get('/:contactId')
    @HttpCode(200)
    async get(
        @Auth() user:User,
        @Param('contactId',ParseIntPipe) contactId:number
    ):Promise<WebResponse<ContactResponse>>{
        const result=await this.contactService.get(user,contactId);
        return {
            data:result
        }
    }
}

