/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { StoriesModule } from '@snhuproduct/toboggan-ui-components-library';
import { IAssociationGroup } from '@toboggan-ws/toboggan-common';
import { of } from 'rxjs';
import { ModalAlertService } from '../../../shared/services/modal-alert/modal-alert.service';
import { AssociationGroupService } from '../../services/association-group.service';

import { AssociationGroupListComponent } from './association-group-list.component';

const mockGroups: IAssociationGroup[] = [];
for (let i = 0; i < 20; i++) {
  mockGroups.push({
    uuid: i as unknown as string,
    type: 'learner',
    name: `Group name-${i}`,
    description: `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.`,
    members: []
  });
}

describe('GroupListComponent with empty results ', () => {
  let component: AssociationGroupListComponent;
  let fixture: ComponentFixture<AssociationGroupListComponent>;
  const mockGroupService = {
    fetchAssociationGroups: jest.fn().mockReturnValue(of([])),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoriesModule, NoopAnimationsModule],
      declarations: [AssociationGroupListComponent],
      providers: [
        { provide: AssociationGroupService, useValue: mockGroupService },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of([{ id: 1 }]),
          },
        },
        {
          provide: Router,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AssociationGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call service for fetching users', () => {
    const fetchGroups = jest.spyOn(mockGroupService, 'fetchAssociationGroups');
    fixture.detectChanges();
    expect(fetchGroups).toHaveBeenCalled();
  });

  it('table should show "No Results Found" when no groups are available', () => {
    const noResultsContainer = fixture.debugElement.query(
      By.css('.gp-table-x-noresults')
    );
    expect(noResultsContainer).toBeDefined();
  });
});

describe('GroupListComponent ', () => {
  let component: AssociationGroupListComponent;
  let fixture: ComponentFixture<AssociationGroupListComponent>;
  let modalAlertService: ModalAlertService;
  const mockGroupService = {
    fetchAssociationGroups: jest.fn().mockReturnValue(of(mockGroups)),
    deleteAssociationGroup: jest.fn().mockReturnValue(of({})),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoriesModule, NoopAnimationsModule],
      declarations: [AssociationGroupListComponent],
      providers: [
        { provide: AssociationGroupService, useValue: mockGroupService },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of([{ id: 1 }]),
          },
        },
        {
          provide: Router,
          useValue: {},
        },
        ModalAlertService,
      ],
    }).compileComponents();
    modalAlertService = TestBed.inject(ModalAlertService);
    fixture = TestBed.createComponent(AssociationGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should call row action on delete action & confirmation modal', () => {
    fixture.detectChanges();
    const menuButton = fixture.debugElement.query(
      By.css('.gp-table-x-editmenubutton')
    );
    menuButton.nativeElement.click();
    fixture.detectChanges();

    const rowActionSpy = jest.spyOn(component, 'onRowAction');
    const deletegroupSpy = jest.spyOn(component, 'openDeleteGroupConfirmation');
    const deleteButton = Array.from(document.querySelectorAll('button')).filter(
      (button) => button.textContent?.includes('Delete')
    )[0];
    deleteButton.click();
    fixture.detectChanges();

    expect(rowActionSpy).toHaveBeenCalled();
    expect(deletegroupSpy).toHaveBeenCalled();
  });

  it('should open delete group modal', () => {
    fixture.detectChanges();
    const menuButton = fixture.debugElement.query(
      By.css('.gp-table-x-editmenubutton')
    );
    menuButton.nativeElement.click();
    fixture.detectChanges();

    const showModalAlertSpy = jest.spyOn(modalAlertService, 'showModalAlert');

    const deleteButton = Array.from(document.querySelectorAll('button')).filter(
      (button) => button.textContent?.includes('Delete')
    )[0];
    deleteButton.click();
    fixture.detectChanges();

    expect(showModalAlertSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        heading: `Remove this association group`,
      })
    );
  });

  it('should call delete api', async () => {
    // @ts-ignore:
    const spyAPI = jest.spyOn(component, 'deleteGroupAPI');
    // @ts-ignore:
    const spyNotification = jest.spyOn(component, 'showNotification');
    // @ts-ignore:
    await component.deleteGroup('uuid', 'name');
    expect(spyAPI).toBeCalledTimes(1);
    expect(spyNotification).toBeCalledWith(
      'success',
      '',
      '<strong>name</strong> has been removed.',
      true
    );
  });
});
