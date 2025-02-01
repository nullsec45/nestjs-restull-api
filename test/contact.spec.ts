import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestModule } from './test.module';
import { TestService } from './test.service';

describe('UserController', () => {
  let app: INestApplication;
   let logger: Logger;
   let testService:TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule,TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService=app.get(TestService);
  });

  describe('POST /api/users',() => {
    beforeEach(async() => {
      await testService.deleteContact();
      await testService.deleteUser();

      await testService.createUser();
    });

    it('should be rejected if request is invalid', async() => {
        const response= await request(app.getHttpServer())
                              .post('/api/contacts')
                              .set('Authorization','test')
                              .send({
                                first_name:'',
                                last_name:'',
                                email:'salah',
                                phone:''
                              });

        logger.info(response.body);
                              
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should be able to create contact', async() => {
        const response= await request(app.getHttpServer())
                              .post('/api/contacts')
                              .set('Authorization','test')
                              .send({
                                  first_name:'fajar',
                                  last_name:'fijir',
                                  email:'fajar@gmail.com',
                                  phone:'0812345678'
                              });
        
        logger.info(response.body);          

        expect(response.status).toBe(201);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.first_name).toBe('fajar');
        expect(response.body.data.last_name).toBe('fijir');
        expect(response.body.data.email).toBe('fajar@gmail.com');
        expect(response.body.data.phone).toBe('0812345678');
    });

    it.skip('should be able rejected if contact already exists', async() => {
        await testService.createUser();
        const response= await request(app.getHttpServer())
                              .post('/api/users')
                              .set('Authorization','test')
                              .send({
                                  first_name:'fajar',
                                  last_name:'fijir',
                                  email:'fajar@gmail.com',
                                  phone:'999999'
                              });
        
        logger.info(response.body);          

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
  });
});

