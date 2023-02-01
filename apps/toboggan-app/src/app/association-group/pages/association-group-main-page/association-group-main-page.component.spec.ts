import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociationGroupMainPageComponent } from './association-group-main-page.component';

describe('AssociationGroupMainPageComponent', () => {
  let component: AssociationGroupMainPageComponent;
  let fixture: ComponentFixture<AssociationGroupMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssociationGroupMainPageComponent],
      providers: [HttpClient, HttpHandler],
    }).compileComponents();

    fixture = TestBed.createComponent(AssociationGroupMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
