import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLogin = true;

  constructor(private authSrvc: AuthService, private router: Router) { }

  ngOnInit() {
  }

  onLogin() {
    this.authSrvc.login();
    this.router.navigateByUrl('/home');
  }

  onSubmit(form:NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    console.log(email, password);

    if (this.isLogin) {
      //Send request to login servers
    } else {
      //Send request to signup servers
    }
  }

  onswitchAuthMode() {
    this.isLogin = !this.isLogin;
  }

}
