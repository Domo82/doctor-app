import { Component, OnInit, OnDestroy } from '@angular/core';
import { Platform, NavController } from '@ionic/angular';
import { AuthService } from './auth/auth.service';
import { Plugins, Capacitor } from '@capacitor/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Subscription } from 'rxjs';


// import { Route } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    private authSub: Subscription;
    private previousAuthState = false;

  constructor(
    private platform: Platform,
    private authSrvc: AuthService,
    private router: Router,
    private firestore: AngularFirestore

  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if(Capacitor.isPluginAvailable('SplashScreen')) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  ngOnInit() {
    this.authSub = this.authSrvc.userIsAuthenticated.subscribe(isAuth => {
      if (!isAuth && this.previousAuthState !== isAuth) {
        this.router.navigateByUrl('/auth');
      }
      this.previousAuthState = isAuth;
    });
  }

  onLogout() {
    this.authSrvc.logout();
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

}
