import { Component, ViewChild } from '@angular/core';
import { ModalButtonConfig } from '@snhuproduct/toboggan-ui-components-library';
import { AuthService } from '../../../shared/auth/auth.service';
import { ModalCancelApiService } from '../../../shared/services/cancel-api/cancel-api.service';
import { UserService } from '../../../shared/services/user/user.service';
import { CreateUserComponent } from '../../components/create-user/create-user.component';

@Component({
  selector: 'toboggan-ws-user-main-page',
  templateUrl: './user-main-page.component.html',
  styleUrls: ['./user-main-page.component.scss'],
})
export class UserMainPageComponent {
  constructor(
    private auth: AuthService,
    public userService: UserService,
    public modalCancelApiService: ModalCancelApiService
  ) { }

  @ViewChild('createUserModal', { static: false })
  createUserModal?: CreateUserComponent;
  modalLoading = false;

  createUserModalButtonsConfig: ModalButtonConfig[] = [
    {
      title: 'Cancel',
      onClick: () => this.handleCancelCreateUserModalButton(),
      style: 'secondary',
    },
    {
      title: 'Add new user',
      onClick: () => this.handleAddNewUserModalButton(),
      style: 'primary',
    },
  ];

  async handleCancelCreateUserModalButton() {
    return true;
  }

  handleModalLoaderCancel() {
    this.modalCancelApiService.show().subscribe(() => {
      this.userService.unsubscibeUsersApi();
    });
  }

  async handleAddNewUserModalButton() {
    if (!this.createUserModal) {
      return false;
    }
    if (this.createUserModal.userForm.valid) {
      this.modalLoading = true;
    }

    const result = await this.createUserModal.handleAddNewUserModalButton();
    this.modalLoading = false;
    return result;
  }

  logout() {
    this.auth.signOut();
  }
}
