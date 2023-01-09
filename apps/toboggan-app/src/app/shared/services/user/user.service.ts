import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IGroup,
  INewUser, IUser
} from '@toboggan-ws/toboggan-common';
import { BehaviorSubject, firstValueFrom, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class UserService {
  users: IUser[] = [];
  groups: IGroup[] = [];

  editingUser: IUser | undefined;
  private _userUpdated = new BehaviorSubject<IUser>({} as IUser);
  userUpdated$ = this._userUpdated.asObservable();
  private usersApi: any;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private http: HttpClient) { }



  fetchUsers() {
    return this.http.get<IUser[]>(`/api/users`);
  }

  fetchPaginatedUsers(currentPage: number, resultsPerPage: number = 10) {
    return this.http.get<IUser[]>(
      `/api/users?currentPage=${currentPage}&resultsPerPage=${resultsPerPage}`
    );
  }

  async createUser(user: INewUser): Promise<unknown> {
    return firstValueFrom(this.http.post('/api/users', user)
      .pipe(takeUntil(this.ngUnsubscribe)));
  }

  async resetPassword(email: string): Promise<unknown> {
    return firstValueFrom(
      this.http.post(`/api/authentication/passwordresetemail`, { email: email })
    );
  }

  async updateUser(updatedUser: Partial<IUser>, userId: string): Promise<void> {
    await firstValueFrom(this.http.put(`/api/users/${userId}`, updatedUser)
      .pipe(takeUntil(this.ngUnsubscribe)));
  }
  
  async updateUserStatus(updatedUserStatus: Partial<IUser>, userId: string): Promise<void> {
    await firstValueFrom(this.http.post(`/api/users/status/${userId}`, updatedUserStatus));
  }
  async patchUser(patchUser: Partial<IUser>, userId: string): Promise<void> {
    await firstValueFrom(this.http.patch(`/api/users/${userId}`, patchUser));
    this.fetchUsers();
  }

  unsubscibeUsersApi() {
    // This aborts HTTP requests.
    this.ngUnsubscribe.next();
    // This completes the subject properlly.
    this.ngUnsubscribe.complete();
  }

  setEditingUser(user: IUser) {
    this.editingUser = user;
  }

  publishUserEditComplete(user: IUser) {
    this._userUpdated.next(user);
  }
}
