import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, from } from 'rxjs';
import { User } from './user.model';
import { map, tap } from 'rxjs/operators';
import { Plugins } from '@capacitor/core';
import { UrlSerializer } from '@angular/router';

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
export class AuthService implements OnDestroy{

 // tslint:disable-next-line: variable-name
 private _user = new BehaviorSubject<User>(null);
 private activeLogoutTimer: any;
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

  autoLogin() {
    return from(Plugins.Storage.get({key: 'authData'})).pipe(
      map(storedData => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          token: string;
          tokenExpirationDate: string;
          userId: string;
          email: string;
        };
        const expirationTime = new Date(parsedData.tokenExpirationDate);
        if (expirationTime <= new Date()) {
          return null;
        }
        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime
        );
        return user;
      }),
      tap(user => {
        if (user) {
          this._user.next(user);
          this.autoLogout(user.tokenDuration);
        }
      }),
      map(user => {
        return !!user;
      })
    );
  }

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
    {email: email, password: password, returnSecureToken: true}
    ).pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    // remove any existing logout timers
    if(this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this._user.next(null);
    Plugins.Storage.remove({key: 'authData'})
  }

  private autoLogout(duration: number) {
    //remove any existing logout timers
    if(this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, duration);
  }

  // onLogin() {
  //   this.authSrvc.login();
  // }

  private setUserData(userData: AuthResponseData) {
      const expirationTime = new Date(
        new Date().getTime() + +userData.expiresIn * 1000
        );
        const user = new User(
          userData.localId,
          userData.email,
          userData.idToken,
          expirationTime
        );
      this._user.next(user);
        this.autoLogout(user.tokenDuration);
        this.storeAuthData(
          userData.localId,
          userData.idToken,
          expirationTime.toISOString(),
          userData.email,
        );
      }

  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationDate: string,
    email: string
    ) {
      const data = JSON.stringify({
        userId: userId,
        token: token,
        tokenExpirationDate: tokenExpirationDate,
        email: email
      });
      Plugins.Storage.set({key: 'authData', value: data});
  }

  ngOnDestroy() {
    // clean up any existing timers when timer gets destroyed to prevent memory leaks
    if(this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
  }

}
