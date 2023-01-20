import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ISignedUrlResponse } from '@toboggan-ws/toboggan-common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ContentServingService {
  constructor(private httpService: HttpService) {}

  public async getSignedUrl(uuid: string): Promise<ISignedUrlResponse> {
    const result = await this.executeContentServingCall<ISignedUrlResponse>(
      `/content-serving/${uuid}`
    );
    return result;
  }

  private async executeContentServingCall<T>(url: string): Promise<T> {
    try {
      const response = await firstValueFrom(this.httpService.get(url));

      const payload = response?.data;
      if (payload?.success === 'false') {
        throw new Error(payload.message);
      }

      return payload?.data;
    } catch (error) {
      console.log('Content serving call failed', error);
      throw error;
    }
  }
}
