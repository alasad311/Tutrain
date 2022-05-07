import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './service/storage/storage.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import {  MenuController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { AuthGuardService } from './service/Auth/auth-guard.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  
})
export class AppComponent {
  constructor( private auth:AuthGuardService, private platform:Platform,private router: Router,public menuCtrl: MenuController, private screenOrientation: ScreenOrientation, private storage : StorageService) {
    this.initializeApp();

   }
  async initializeApp() {
    this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY);
    // If using a custom driver:
    // await this.storage.defineDriver(MyCustomDriver)
    await this.storage.init();
    const email = await this.storage.get("email");
     
    this.platform.ready().then((readySource) => {
      if (email) {
        this.menuCtrl.enable(true);
        this.router.navigate(['home']);
      } else {
        // this.menuCtrl.enable(false);
        // this.router.navigate(['welcome']);
        this.menuCtrl.enable(true);
        this.router.navigate(['home']);
      }
    });
  }
  async logout(){
    await this.storage.clear()
    this.router.navigate(['/welcome']);
  }
}
