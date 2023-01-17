import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurriculumPathwayComponent } from './curriculum-pathway.component';

describe('CurriculumPathwayComponent', () => {
  let component: CurriculumPathwayComponent;
  let fixture: ComponentFixture<CurriculumPathwayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurriculumPathwayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CurriculumPathwayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
