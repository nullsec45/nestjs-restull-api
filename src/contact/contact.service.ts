import { Inject,Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "@nestjs/common";
import { PrismaService } from "../common/prisma.service";
import { ValidationService } from "../common/validation.service";
import { ContactResponse, CreateContactRequest } from "../model/contact.model";
import { User } from "@prisma/client";
import { ContactValidation } from "./contact.validation";

@Injectable()
export class ContactService{
    constructor(
        @Inject(WINSTON_MODULE_PROVIDER) private logger:Logger,
        private prismaService:PrismaService,
        private validationService:ValidationService
    ){}

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

        return {
            first_name:contact.first_name,
            last_name:contact.last_name,
            email:contact.email,
            phone:contact.phone,
            id:contact.id
        }
    }
}

