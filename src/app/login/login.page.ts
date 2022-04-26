import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public viewPassword = 'eye-outline';
  public showPassword = false;

  constructor(private router: Router,private navCtrl: NavController) { }

  ngOnInit() {
  }
  goToHome() {
    // this.navCtrl.navigateRoot(['tabs']);
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
