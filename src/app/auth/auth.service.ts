import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { map, tap } from 'rxjs/operators';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

 // tslint:disable-next-line: variable-name
 private _user = new BehaviorSubject<User>(null);
 private creator_name = 'Dr Dillon';
 private creator_id = '12345';

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
        map(user => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map(user => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  get creatorName() {
    return this.creator_name;
  }

  get creatorId() {
    return this.creator_id;
  }



  constructor(private authSrvc: AuthService, private http: HttpClient) { }

  signup(email: string, password: string) {
    return this.http
    .post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${
      environment.firebase.apiKey
    }`, 
    {email: email, password: password, returnSecureToken: true})
    .pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
    return this.http
    .post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${
      environment.firebase.apiKey
    }`,
    {email: email, password: password}
    ).pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    this._user.next(null);
  }

  // onLogin() {
  //   this.authSrvc.login();
  // }

  private setUserData(userData: AuthResponseData) {
      const expirationTime = new Date(
        new Date().getTime() + (+userData.expiresIn * 1000));
      this._user.next(
        new User(
          userData.localId,
          userData.email,
          userData.idToken,
          expirationTime
          )
        );
      }

}
