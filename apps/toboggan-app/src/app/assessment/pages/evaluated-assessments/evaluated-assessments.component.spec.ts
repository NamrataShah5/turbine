import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluatedAssessmentsComponent } from './evaluated-assessments.component';

describe('EvaluatedAssessmentsComponent', () => {
  let component: EvaluatedAssessmentsComponent;
  let fixture: ComponentFixture<EvaluatedAssessmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EvaluatedAssessmentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EvaluatedAssessmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
