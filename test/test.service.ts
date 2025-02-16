import { Contact, Prisma, User } from "@prisma/client";
import { PrismaService } from "../src/common/prisma.service";
import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService{
    constructor(private prismaService:PrismaService){}

    async deleteUser(){
        await this.prismaService.user.deleteMany({
            where:{
                username:'test'
            }
        })
    }

     async deleteContact(){
        await this.prismaService.contact.deleteMany({
            where:{
                username:'test'
            }
        })
    }

    async createUser(){
        await this.prismaService.user.create({
            data:{
                username:'test',
                name:'test',
                password:await bcrypt.hash('test12345678',10),
                token:'test'
            }
        })
    }

    async getUser():Promise<User>{
        return this.prismaService.user.findUnique({
            where:{
                username:'test'
            }
        })
    }

    async getContact():Promise<Contact>{
        return this.prismaService.contact.findFirst({
            where:{
                username:'test'
            }
        })
    }

    async createContact(){
        await this.prismaService.contact.create({
            data:{
                first_name:'test',
                last_name:'test',
                email:'test@example.com',
                phone:'0812345678',
                username:'test'
            }
        });
    }
}