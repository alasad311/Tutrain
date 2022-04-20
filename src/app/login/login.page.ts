/*
  Authors : bunchdevelopers (Rahul Jograna)
  Website : https://bunchdevelopers.com/
  App Name : ionic6Template Pack
  This App Template Source code is licensed as per the
  terms found in the Website https://bunchdevelopers.com/license
  Copyright and Good Faith Purchasers © 2021-present bunchdevelopers.
*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public viewPassword = 'eye-outline';
  public showPassword = false;

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goToAddress(){
    this.router.navigate(['/home']);
  }
  goToRegister(){
    this.router.navigate(['/register']);
  }
  goToForgotPassword(){
    this.router.navigate(['/forgot']);
  }
  togglePassword(){
    if(this.viewPassword == 'eye-off-outline')
    {
      this.viewPassword = 'eye-outline'
      this.showPassword = false;
    }else
    {
      this.viewPassword = 'eye-off-outline'
      this.showPassword = true;
    }
  }
}
