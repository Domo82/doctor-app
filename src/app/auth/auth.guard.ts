import { Injectable } from '@angular/core';
import { CanLoad, UrlSegment, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Route } from '@angular/compiler/src/core';
import { take, tap, switchMap } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private authSrvc: AuthService, private router: Router) {}
  canLoad(
    route: Route,
    segments: UrlSegment[]
    ): Observable<boolean> | Promise<boolean> | boolean {
      return this.authSrvc.userIsAuthenticated.pipe(
        take(1),
        switchMap(isAuthenticated => {
          if (!isAuthenticated) {
            return this.authSrvc.autoLogin();
          } else {
            return of(isAuthenticated);
          }
        }),
        tap(isAuthenticated => {
          if (!isAuthenticated) {
            this.router.navigateByUrl('/auth');
          }
        })
      );
    }
}
