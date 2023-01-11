import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '../../../shared/shared.module';

import { AssessmentDetailsComponent } from './assessment-details.component';

describe('AssessmentDetailsComponent', () => {
  let component: AssessmentDetailsComponent;
  let fixture: ComponentFixture<AssessmentDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssessmentDetailsComponent],
      imports: [SharedModule, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AssessmentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
