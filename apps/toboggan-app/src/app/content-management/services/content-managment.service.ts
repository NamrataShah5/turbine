import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContentManagmentService {

  constructor(private http: HttpClient) { }

  fetchCurriculumPathway(uuid: string) {
    return this.http.get<any>('/api/curriculum-pathway/' + uuid + '?fetch_tree=true');
  }
}
