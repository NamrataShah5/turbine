import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AssociationGroupDetailsPageComponent } from './association-group-details-page.component';

describe('AssociationGroupDetailsPageComponent', () => {
  let component: AssociationGroupDetailsPageComponent;
  let fixture: ComponentFixture<AssociationGroupDetailsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssociationGroupDetailsPageComponent],
      providers: [HttpClient, HttpHandler],
      imports: [RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AssociationGroupDetailsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
