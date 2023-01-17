import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { StoriesModule } from '@snhuproduct/toboggan-ui-components-library';
import { SharedModule } from '../../../shared/shared.module';
import { CurriculumPathwayComponent } from '../../components/curriculum-pathway/curriculum-pathway.component';
import { ContentManagementMainPageComponent } from './content-management-main-page.component';

describe('ContentManagementMainPageComponent', () => {
  let component: ContentManagementMainPageComponent;
  let fixture: ComponentFixture<ContentManagementMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [HttpClient, HttpHandler],
      imports: [
        StoriesModule,
        BrowserModule,
        BrowserAnimationsModule,
        RouterTestingModule,
        SharedModule,
      ],
      declarations: [
        CurriculumPathwayComponent,
        ContentManagementMainPageComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContentManagementMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
