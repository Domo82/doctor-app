import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoadingController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthResponseData } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLogin = true;
  isLoading = false;


  constructor(
    private authSrvc: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    ) { }

  ngOnInit() {
  }

  authenticate(email: string, password: string) {
    this.isLoading = true;
    this.loadingCtrl
    .create({keyboardClose: true, message: 'Logging in...'})
    .then(loadingEl => {
      loadingEl.present();
      let authObs: Observable<AuthResponseData>;
      if (this.isLogin) {
        authObs = this.authSrvc.login(email, password);
      } else {
        authObs = this.authSrvc.signup(email,password);
      }
      authObs.subscribe(
        resData => {
        console.log(resData);
        this.isLoading = false;
        loadingEl.dismiss();
        this.router.navigateByUrl('/home');
      }, errRes => {
        loadingEl.dismiss()
        const code = errRes.error.error.message;
        let message = 'Cannot sign up. Please try again.';
        if (code === 'EMAIL_EXISTS') {
          message = 'This email address already exists.';
        } else if (code == 'EMAIL_NOT_FOUND') {
          message = 'Email address could not be found.';
        } else if (code === 'INVALID_PASSWORD') {
          message = 'This password is not correct.';
        }
        this.showAlert(message);
      }
      );
    });
  }

  onswitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

  onSubmit(form:NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.authenticate(email,password);
    form.reset();
  }

  private showAlert(message: string) {
    this.alertCtrl
    .create({
      header: 'Authentication Failed',
      message: message,
      buttons: ['Okay']
    })
    .then(alertEl => alertEl.present());
    }

  }

