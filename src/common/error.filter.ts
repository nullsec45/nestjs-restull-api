import { 
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException
 } from '@nestjs/common';
 import { ZodError } from 'zod';

export class ErrorFilter{
    catch(exception:any, host:ArgumentsHost){
        const response=host.switchToHttp().getResponse();

        if(exception instanceof HttpException){
            response.status(exception.getStatus()).json({
                errors:exception.getResponse()
            });
        }else if(exception instanceof ZodError){
            response.status(400).json({
                errors:exception.message
            });
        }else{
            response.status(500).json({
                errors:exception.message
            })
        }
    }
}