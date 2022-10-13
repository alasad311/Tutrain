import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(private router: Router,private statusBar: StatusBar) { }
  ngOnInit() {}
  ionViewDidEnter() {
    this.statusBar.backgroundColorByHexString('#ffffff');
  }
  goToLogin(){
    this.router.navigate(['/login']);
  }
  goToRegister(){
    this.router.navigate(['/register']);
  }

}
