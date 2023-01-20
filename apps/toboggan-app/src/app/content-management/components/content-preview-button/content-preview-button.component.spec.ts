import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlSerializer } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ContentPreviewButtonComponent } from './content-preview-button.component';

describe('ContentPreviewButtonComponent', () => {
  let component: ContentPreviewButtonComponent;
  let fixture: ComponentFixture<ContentPreviewButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContentPreviewButtonComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: UrlSerializer,
          useValue: {}
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContentPreviewButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
