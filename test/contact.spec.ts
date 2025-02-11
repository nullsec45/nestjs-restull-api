import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { TestModule } from './test.module';
import { TestService } from './test.service';

describe('Contact Controller', () => {
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

    describe.skip('POST /api/contacts/',() => {
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

    describe.skip('GET /api/contacts/:contactId',() => {
      beforeEach(async() => {
        await testService.deleteContact();
        await testService.deleteUser();

        await testService.createUser();
        await testService.createContact();
      });
  
      it.skip('should be rejected if contact is not found', async() => {
          const contact=await testService.getContact();
          const response= await request(app.getHttpServer())
                                .get(`/api/contacts/${contact.id+1}`)
                                .set('Authorization','test');
  
          logger.info(response.body);
                                
          expect(response.status).toBe(404);
          expect(response.body.errors).toBeDefined();
      });
  
      it('should be able to get contact', async() => {
          const contact=await testService.getContact();
          const response= await request(app.getHttpServer())
                                .get(`/api/contacts/${contact.id}`)
                                .set('Authorization','test');
  
          expect(response.status).toBe(200);
          expect(response.body.data.id).toBeDefined();
          expect(response.body.data.first_name).toBe('test');
          expect(response.body.data.last_name).toBe('test');
          expect(response.body.data.email).toBe('test@example.com');
          expect(response.body.data.phone).toBe('0812345678');
      });
    });

    describe('UPDATE /api/contacts/:contactId',() => {
      beforeEach(async() => {
        await testService.deleteContact();
        await testService.deleteUser();

        await testService.createUser();
        await testService.createContact();
      });
  
       it('should be rejected if request is invalid', async() => {
          const contact=await testService.getContact();
          const response= await request(app.getHttpServer())
                                .put(`/api/contacts/${contact.id}`)
                                .set('Authorization','test')
                                .send({
                                  first_name:'',
                                  last_name:'',
                                  email:'salah',
                                  phone:''
                                });

          // logger.info(response.body);
                                
          expect(response.status).toBe(400);
          expect(response.body.errors).toBeDefined();
      });

      it.skip('should be rejected if contact is not found', async() => {
          const contact=await testService.getContact();
          const response= await request(app.getHttpServer())
                                .put(`/api/contacts/${contact.id+1}`)
                                .set('Authorization','test');
  
          // logger.info(response.body);
                                
          expect(response.status).toBe(401);
          expect(response.body.errors).toBeDefined();
      });
  
      it('should be able to update contact', async() => {
          const contact=await testService.getContact();
          const response= await request(app.getHttpServer())
                                .put(`/api/contacts/${contact.id}`)
                                .set('Authorization','test')
                                .send({
                                  first_name:'test update',
                                  last_name:'test update',
                                  email:'update@gmail.com',
                                  phone:'08123456789'
                                });
  
          expect(response.status).toBe(200);
          expect(response.body.data.id).toBeDefined();
          expect(response.body.data.first_name).toBe('test update');
          expect(response.body.data.last_name).toBe('test update');
          expect(response.body.data.email).toBe('update@gmail.com');
          expect(response.body.data.phone).toBe('08123456789');
      });
    });

    describe.skip('DELETE /api/contacts/:contactId',() => {
      beforeEach(async() => {
        await testService.deleteContact();
        await testService.deleteUser();

        await testService.createUser();
        await testService.createContact();
      });
  
      it.skip('should be rejected if contact is not found', async() => {
          const contact=await testService.getContact();
          const response= await request(app.getHttpServer())
                                .delete(`/api/contacts/${contact.id+1}`)
                                .set('Authorization','test');
  
          logger.info(response.body);
                                
          expect(response.status).toBe(404);
          expect(response.body.errors).toBeDefined();
      });
  
      it('should be able to get contact', async() => {
          const contact=await testService.getContact();
          const response= await request(app.getHttpServer())
                                .get(`/api/contacts/${contact.id}`)
                                .set('Authorization','test');
  
          expect(response.status).toBe(200);
          expect(response.body.data).toBe(true);
      });
    });
});

