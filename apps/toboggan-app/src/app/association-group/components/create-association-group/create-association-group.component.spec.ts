import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { StoriesModule } from '@snhuproduct/toboggan-ui-components-library';
import { of } from 'rxjs';
import { SharedModule } from '../../../shared/shared.module';
import { AssociationGroupService } from '../../services/association-group.service';
import { CreateAssociationGroupComponent } from './create-association-group.component';

describe('CreateGroupComponent', () => {
  let component: CreateAssociationGroupComponent;
  let fixture: ComponentFixture<CreateAssociationGroupComponent>;

  const mockGroupService = {
    createAssociationGroup: jest.fn().mockReturnValue(of({})),
    publishGroupCompleted: jest.fn()
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateAssociationGroupComponent],
      imports: [
        StoriesModule,
        ReactiveFormsModule,
        HttpClientModule,
        SharedModule,
      ],
      providers: [{ provide: AssociationGroupService, useValue: mockGroupService }],
    }).compileComponents();
    fixture = TestBed.createComponent(CreateAssociationGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('createGroup method should call', async() => {
    jest.spyOn(component, 'createGroup');
    component.createGroupForm.setValue({
      name: 'name',
      groupType: 'learner',
      description: 'description',
      addUser: false,
    });
    await component.createGroup();
    expect(mockGroupService.createAssociationGroup).toHaveBeenCalledTimes(1);
  });

  it('getErrorMessage method should check name with special characters ! @ # $', () => {
    jest.spyOn(component, 'getErrorMessage');
    component.createGroupForm.setValue({
      name: 'name@',
      groupType: 'learner',
      description: 'description',
      addUser: false,
    });
    component.getErrorMessage('name');
    expect(component.createGroupForm.valid).toBeFalsy();
  });

  it('getErrorMessage method should check name with other special characters', () => {
    jest.spyOn(component, 'getErrorMessage');
    component.createGroupForm.setValue({
      name: 'name+',
      groupType: 'learner',
      description: 'description',
      addUser: false,
    });
    component.getErrorMessage('name');
    expect(component.createGroupForm.valid).toBeFalsy();
  });
});
