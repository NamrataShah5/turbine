import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ISignedUrlResponse } from '@toboggan-ws/toboggan-common';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  constructor(private httpClient: HttpClient) {}

  getFile(filename: string): Promise<string> {
    return firstValueFrom(
      this.httpClient.get('content/' + filename, { responseType: 'text' })
    );
  }

  async downloadContent(uuid: string): Promise<string> {
    const result = await firstValueFrom(
      this.httpClient.get('/api/content-serving/data/' + uuid, {
        responseType: 'text',
      })
    );
    return result;
  }

  async getSignedUrl(uuid: string): Promise<ISignedUrlResponse> {
    const result = await firstValueFrom(
      this.httpClient.get<ISignedUrlResponse>('/api/content-serving/url/' + uuid)
    );
    return result;
  }
}
