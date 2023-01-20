import { HttpModule, HttpService } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { ContentServingService } from './content-serving.service';

describe('ContentServingService', () => {
  let service: ContentServingService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ContentServingService],
    }).compile();

    httpService = module.get(HttpService);

    service = module.get<ContentServingService>(ContentServingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('when request fails', async () => {
    jest
      .spyOn(httpService, 'get')
      .mockReturnValue(throwError(() => new Error('something failed')));

    await expect(service.getSignedUrl('test')).rejects.toThrowError(
      'something failed'
    );
  });

  it('when response does not contain success status, error is thrown', async () => {
    jest
      .spyOn(httpService, 'get')
      .mockReturnValue(
        of({
          data: { success: 'false' },
          status: 200,
          statusText: '',
          headers: {},
          config: {},
        })
      );

    await expect(service.getSignedUrl('test')).rejects.toThrow();
  });

  it('when response contain success status, data is returned', async () => {
    const data = { signed_url: 'test' };
    jest
      .spyOn(httpService, 'get')
      .mockReturnValue(
        of({
          data: { success: 'true', data: data },
          status: 200,
          statusText: '',
          headers: {},
          config: {},
        })
      );

    const result = await service.getSignedUrl('test');
    expect(result).toEqual(data);
  });
});
