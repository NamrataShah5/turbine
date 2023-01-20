import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ContentPreviewComponent } from './content-preview.component';

describe('ContentPreviewComponent', () => {
  let component: ContentPreviewComponent;
  let fixture: ComponentFixture<ContentPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContentPreviewComponent],
      imports: [ RouterTestingModule, HttpClientTestingModule ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContentPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
