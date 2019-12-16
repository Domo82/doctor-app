import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 // tslint:disable-next-line: variable-name
 private _userIsAuthenticated = true;
 private creator_name = 'Dr Dillon';
 private creator_id = '12345';

  get creatorName() {
    return this.creator_name;
  }

  get creatorId() {
    return this.creator_id;
  }


  get userIsAuthenticated() {
    return this._userIsAuthenticated;
  }

  constructor(private authSrvc: AuthService) { }

  login() {
    this._userIsAuthenticated = true;
  }

  logout() {
    this._userIsAuthenticated = false;
  }

  onLogin() {
    this.authSrvc.login();
  }
}
