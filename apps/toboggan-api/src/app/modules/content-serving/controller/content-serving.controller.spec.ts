import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { ContentServingService } from '../service/content-serving.service';
import { ContentServingController } from './content-serving.controller';

describe('ContentServingController', () => {
  let controller: ContentServingController;
  let contentServingService: ContentServingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentServingController],
      imports: [HttpModule],
      providers: [ContentServingService],
    }).compile();

    controller = module.get<ContentServingController>(ContentServingController);
    contentServingService = module.get<ContentServingService>(
      ContentServingService
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getSignedUrl call contentServingService and returns the result', async () => {
    const expected = { signed_url: 'test', resource_type: 'test' };
    jest
      .spyOn(contentServingService, 'getSignedUrl')
      .mockResolvedValue(expected);
    const result = await controller.getSignedUrl('test');
    expect(result).toEqual(expected);
  });

  it('getData first gets url and then downloads content', async () => {
    const urlResult = { signed_url: 'testurl', resource_type: 'test'  };
    jest
      .spyOn(contentServingService, 'getSignedUrl')
      .mockResolvedValue(urlResult);

    const content = 'abcdefgh';
    jest.spyOn(axios, 'get').mockImplementation(async (url) => {
      if (url === urlResult.signed_url) {
        return Promise.resolve({ data: content });
      }
    });

    const result = await controller.getData('test');
    expect(result).toEqual(content);
  });
});
