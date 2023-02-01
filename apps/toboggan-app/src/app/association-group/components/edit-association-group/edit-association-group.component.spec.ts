import {
  HttpClient,
  HttpClientModule,
  HttpHandler,
} from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { StoriesModule } from '@snhuproduct/toboggan-ui-components-library';
import { mock, MockProxy } from 'jest-mock-extended';
import { BannerService } from '../../../shared/services/banner/banner.service';
import { SharedModule } from '../../../shared/shared.module';
import { AssociationGroupService } from '../../services/association-group.service';

import { EditAssociationGroupComponent } from './edit-association-group.component';

describe('EditAssociationGroupComponent', () => {
  let component: EditAssociationGroupComponent;
  let fixture: ComponentFixture<EditAssociationGroupComponent>;
  const mockGroupService: MockProxy<AssociationGroupService> =
    mock<AssociationGroupService>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditAssociationGroupComponent],
      providers: [
        HttpClient,
        HttpHandler,
        { provide: AssociationGroupService, useValue: mockGroupService },
        BannerService,
      ],
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        StoriesModule,
        ReactiveFormsModule,
        SharedModule,
      ],
    });
    fixture = TestBed.createComponent(EditAssociationGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
