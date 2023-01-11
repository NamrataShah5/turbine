import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { environment } from '../../../environments/environment';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationController', () => {
  let app: TestingModule;
  let service: AuthenticationService;
  const mockService = {
    sendPasswordResetEmail: () => {""},
    loginWithCredentials: (username,password) => {""}
  };
  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        HttpModule.register({
          baseURL: environment.GPCoreBaseUrl + '/authentication/api/v1',
          timeout: 8000,
          maxRedirects: 3,
        }),
      ],
      controllers: [AuthenticationController],
      providers: [
        AuthenticationService,
      ],
    })
      .overrideProvider(AuthenticationService)
      .useValue(mockService)
      .compile();
      service = app.get<AuthenticationService>(AuthenticationService);
  });
  it('should be defined', () => {
    const controller = app.get<AuthenticationController>(
      AuthenticationController
    );
    expect(controller).toBeDefined();
  });

  describe('sendPasswordResetEmail', () => {
    const mockQuery = {email: "somemail@email.com"};
    it('should throw error', async () => {
      const controller = app.get<AuthenticationController>(
        AuthenticationController
      );
      await (expect(controller.sendPasswordResetEmail(mockQuery))).toBeUndefined();
      expect(service.loginWithCredentials)
    });
  });

  describe('loginwithcreds', () => {
    const mockQuery = {email: "somemail@email.com", password: 'test'};
    const spy  = jest.spyOn(mockService,'loginWithCredentials')
    it('should throw error', async () => {
      const controller = app.get<AuthenticationController>(
        AuthenticationController
      );
      await controller.loginWithCredentials(mockQuery);
      expect(spy).toBeCalled();
    });
  });
});
