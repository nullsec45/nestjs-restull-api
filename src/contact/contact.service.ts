import { HttpException, Inject,Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";
import { ContactResponse, CreateContactRequest, UpdateContactRequest } from "../model/contact.model";
import { User,Contact } from "@prisma/client";
import { ContactValidation } from "./contact.validation";

@Injectable()
export class ContactService{
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private logger:Logger,
        private prismaService:PrismaService,
        private validationService:ValidationService
    ){}

    private contactResponse(contact:Contact):ContactResponse{
        return {
            first_name:contact.first_name,
            last_name:contact.last_name,
            email:contact.email,
            phone:contact.phone,
            id:contact.id
        }
    }

    async create(
        user:User,
        request:CreateContactRequest
    ):Promise<ContactResponse>{
        const createRequest:CreateContactRequest=this.validationService.validate(
            ContactValidation.CREATE,
            request
        );

        const contact=await this.prismaService.contact.create({
            data:{
                ...createRequest,
                ...{username:user.username}
            }
        });

        return this.contactResponse(contact);
    }

    async checkContactMustExists(username:string,contactId:number):Promise<Contact>{
        const contact=await this.prismaService.contact.findFirst({
            where:{
                username:username,
                id:contactId
            }
        });

        if(!contact){
            throw new HttpException('Contact is not found',404);
        }

        return contact;
    }

    async get(user:User,contactId:number):Promise<ContactResponse>{
        const contact=await this.checkContactMustExists(user.username,contactId);

        return this.contactResponse(contact);
    }

    async update(
        user:User,
        request:UpdateContactRequest
    ):Promise<ContactResponse>{
        const updateRequest=this.validationService.validate(ContactValidation.UPDATE,request);

        let contact=await this.checkContactMustExists(user.username,updateRequest.id);

        contact=await this.prismaService.contact.update({
            where:{
                id:contact.id,
                username:contact.username
            },
            data:updateRequest
        })

        return this.contactResponse(contact);
    }

    async remove(user:User,contactId:number):Promise<ContactResponse>{
        await this.checkContactMustExists(user.username,contactId);

        const contact=await this.prismaService.contact.delete({
            where:{
                id:contactId,
                username:user.username
            }
        });

        return this.contactResponse(contact);
    }
}

