import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContentSelectionService {

  private _selectedContentId: string | undefined;

  get selectedContentId(){
    return this._selectedContentId;
  }

  selectContent(id: string | undefined){
    this._selectedContentId = id;
  }
}
